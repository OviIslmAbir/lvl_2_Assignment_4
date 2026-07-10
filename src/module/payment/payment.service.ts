import Stripe from "stripe";
import httpStatus from "http-status";
import {
  PaymentProvider,
  PaymentStatus,
  RentalStatus,
} from "../../../generated/prisma/enums.js";
import config from "../../config/index.js";
import ApiError from "../../error/apiError.js";
import { prisma } from "../../lib/prisma.js";
import { IPayment } from "./payment.interface.js";

const stripe = new Stripe(config.stripe_secret_key);

const createPaymentSessionFromDB = async (
  payload: IPayment,
  tenantId: string
) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id: payload.rentalRequestId,
    },
    include: {
      property: true,
      payment: true,
    },
  });

  if (!rental) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Rental request not found"
    );
  }

  if (rental.tenantId !== tenantId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Unauthorized access"
    );
  }

  if (rental.status !== RentalStatus.APPROVED) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Rental request is not approved"
    );
  }

  if (rental.payment) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Payment already exists"
    );
  }

  const rentPriceNumber = Number(rental.property.rentPrice);

  const payment = await prisma.payment.create({
    data: {
      rentalRequestId: rental.id,
      amount: rentPriceNumber,
      provider: PaymentProvider.STRIPE,
      status: PaymentStatus.PENDING,
    },
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",

            unit_amount: Math.round(rentPriceNumber * 100),

            product_data: {
              name: rental.property.title,
              description: rental.property.address,
            },
          },
        },
      ],

      metadata: {
        paymentId: payment.id,
      },
success_url: `${config.app_url}/api/payments/payment-success?paymentId=${payment.id}`,

cancel_url: `${config.app_url}/api/payments/payment-cancel`,
    });

    return {
      checkoutUrl: session.url,
    };
  } catch (err: any) {
    await prisma.payment.delete({
      where: { id: payment.id },
    });

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to create checkout session: ${err.message}`
    );
  }
};

const stripeWebhookFromDB = async (
  body: Buffer,
  signature: string
) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      config.stripe_webhook_secret
    );
  } catch (err: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Webhook Error: ${err.message}`
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const paymentId = session.metadata?.paymentId;

    if (!paymentId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Payment id not found"
      );
    }

    const existingPayment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (existingPayment && existingPayment.status !== PaymentStatus.COMPLETED) {
      await prisma.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          transactionId: session.payment_intent as string,
          status: PaymentStatus.COMPLETED,
          paidAt: new Date(),
          method: "CARD",
        },
      });
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;

    const paymentId = session.metadata?.paymentId;

    if (paymentId) {
      await prisma.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: PaymentStatus.FAILED,
        },
      });
    }
  }

  return {
    received: true,
  };
};

const getMyPaymentsFromDB = async (tenantId: string) => {
  return await prisma.payment.findMany({
    where: {
      rentalRequest: {
        tenantId,
      },
    },
    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSinglePaymentFromDB = async (
  id: string,
  tenantId: string
) => {
  const payment = await prisma.payment.findFirst({
    where: {
      id,
      rentalRequest: {
        tenantId,
      },
    },
    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
    },
  });

  if (!payment) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Payment not found"
    );
  }

  return payment;
};

export const paymentService = {
  createPaymentSessionFromDB,
  stripeWebhookFromDB,
  getMyPaymentsFromDB,
  getSinglePaymentFromDB,
};
