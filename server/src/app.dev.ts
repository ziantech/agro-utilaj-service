import express , { Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import morgan from 'morgan'
import { validateEnv } from './helpers/validate-env';
import { connectDbDev } from './config/db';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes'

dotenv.config();

try {
    validateEnv();
} catch (error: any) {
    console.error(error.message);
    process.exit(1);
}


const app = express();

connectDbDev();

app.use(helmet());
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(
    cors({
        origin: [process.env.CORS_ORIGIN!],
        methods: process.env.CORS_METHODS?.split(',') || ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);

app.use(morgan('dev'));

//Routes

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/product', productRoutes)

app.use('/test', (req: Request, res: Response) => {
    res.send('Backend Working in Development Mode');
});




export default app;