import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import { notFound } from './middleware/errorMiddleware.js'
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();
app.use(express.json());
dotenv.config();
connectDB();




app.get('/', function(req,res){
    res.send('running');
})

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes )
app.use('/api/orders',orderRoutes);

app.get('/api/config/paypal', (req,res)=> res.send( process.env.PAYPAL_CLIENT_ID ) )

app.use(notFound);


const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`port running in ${process.env.NODE_ENV} at ${PORT}`));