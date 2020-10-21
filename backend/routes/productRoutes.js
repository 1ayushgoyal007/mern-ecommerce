import express from 'express';
const router = express.Router();
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js'



//Fetch All Products
router.get('/', asyncHandler(async (req,res)=> {
    const products = await Product.find({});
    console.log(products);
    res.json(products);
}));



//Fetch each product

router.get('/:id', (req,res)=>{
    Product.findById(req.params.id).then((product)=>{
        console.log('here is product');
        res.json(product);
    }).catch((err)=>{
        console.log('error occur', err.message);
        res.status(404).json({ message: 'Product not found' });
    })
})




export default router;