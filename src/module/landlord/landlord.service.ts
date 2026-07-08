import { prisma } from "../../lib/prisma";

const getLandlordReviewsFromDB = async (landlordId: string) => {
  const result = await prisma.review.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          city: true,
          rentPrice: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};
export const landlordService = {
  getLandlordReviewsFromDB,
};