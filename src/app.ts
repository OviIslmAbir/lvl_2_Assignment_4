import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from './config';

const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

 
app.get('/', async (req:Request, res:Response ) => {
    res.send('Welcome to my backend project Rent Nest !!!');
});


export default app;