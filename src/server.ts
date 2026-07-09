import app from './app.js';
import config from './config/index.js';
import { prisma } from './lib/prisma.js';


export default app;

async function startServer() {
    try {
        await prisma.$connect();
        console.log('Connected to the database successfully.');  

        if (process.env.NODE_ENV !== 'production') {
            app.listen(config.port, () => {
                console.log(`Server is running on http://localhost:${config.port}`);
            });
        }
    } catch (error) {
        await prisma.$disconnect();
        console.error('Error starting server:', error);
        process.exit(1);
    }
}


startServer();
