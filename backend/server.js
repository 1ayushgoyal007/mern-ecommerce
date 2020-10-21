import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import { notFound } from './middleware/errorMiddleware.js'


const app = express();
dotenv.config();
connectDB();




app.get('/', function(req,res){
    res.send('running');
})
app.use('/api/products', productRoutes);

app.use(notFound);


const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`port running in ${process.env.NODE_ENV} at ${PORT}`));