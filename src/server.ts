import app from './app';
import config from './config';
import { prisma } from './lib/prisma';

async function startServer() {
    try{
        await prisma.$connect();
        console.log('Connected to the database successfully.');  
        app.listen(config.port, () => {
            console.log(`Server is running on http://localhost:${config.port}`);
        });
    } catch (error) {
        await prisma.$disconnect();
        console.error('Error starting server:', error);
        process.exit(1);
    }
}
startServer();