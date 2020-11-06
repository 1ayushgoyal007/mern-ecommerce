import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import { notFound } from './middleware/errorMiddleware.js'
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

if(process.env.NODE_ENV=='development'){
    app.use(morgan('dev'))
}

app.use(express.json());
dotenv.config();
connectDB();


const __dirname = path.resolve();
app.use('/uploads', express.static( path.join(__dirname, '/uploads') ))


if(process.env.NODE_ENV === 'production'){
    console.log('i was called 1');
    console.log('dirname', __dirname);
    console.log('i was called 12');

    app.use(express.static( path.join( __dirname, 'frontend','build' ) ));
    const newPath = path.join( __dirname, 'frontend','build');
    console.log(newPath);
    app.get('/', (req, res)=> {
        console.log('I was called');
        res.sendFile( path.resolve( __dirname, 'frontend', 'build', 'index.html' ) )
    })
}else{
    app.get('/', function(req,res){
        res.send('running');
    })

}



app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes )
app.use('/api/orders',orderRoutes);
app.use('/api/upload',uploadRoutes);

app.get('/api/config/paypal', (req,res)=> res.send( process.env.PAYPAL_CLIENT_ID ) )


app.use(notFound);



const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`port running in ${process.env.NODE_ENV} at ${PORT}`));