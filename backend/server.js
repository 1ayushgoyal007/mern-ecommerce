import express from 'express';
import dotenv from 'dotenv';
import { products } from './data/products.js';

const app = express();
dotenv.config();


app.get('/', function(req,res){
    res.send('running');
})

app.get('/api/products', function(req,res){
    res.json(products);
})

app.get('/api/products/:id', function(req,res){
    const product = products.find( (p)=> p._id === req.params.id );
    res.json(product);
})

const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`port running in ${process.env.NODE_ENV} at ${PORT}`));