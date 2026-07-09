import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from './config/index.js';
import { userRoute } from './module/user/user.route.js';
import { propertiesRoute } from './module/property/property.route.js';
import { landlordRoute } from './module/landlord/landlord.route.js';
import { categoryRoutes } from './module/category/category.route.js';
import { adminRoutes } from './module/Admin/admin.route.js';
import { rentalRoutes } from './module/rental/rental.route.js';
import { paymentRoutes } from './module/payment/payment.route.js';
import { reviewRoutes } from './module/review/review.route.js';

const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}));
app.use(
  "/api/payments/confirm",
  express.raw({ type: "application/json" })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", userRoute);
app.use("/api/properties", propertiesRoute);
app.use("/api/categories", categoryRoutes);
app.use("/api/landlord", landlordRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

app.get('/', async (req:Request, res:Response ) => {
    res.send('Welcome to my backend project Rent Nest !!!');
});


export default app;
