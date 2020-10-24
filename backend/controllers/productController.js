import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js'


//Fetch All Products
const getProducts = asyncHandler( async (req,res)=>{
    const products = await Product.find({});
    res.json(products);
})


//Fetch each product
const getProductById = asyncHandler(async(req,res)=>{
    Product.findById(req.params.id).then((product)=>{
        console.log('here is product');
        res.json(product);
    }).catch((err)=>{
        console.log('error occur', err.message);
        res.status(404).json({ message: 'Product not found' });
    })
})

export { getProducts, getProductById }