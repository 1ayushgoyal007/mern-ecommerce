const express = require('express');

const app = express();

const products = require('./data/products');

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

app.listen(5000,console.log('port running at 5000'));