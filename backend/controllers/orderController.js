import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

//create new order

const addOrderItems = asyncHandler(async(req,res)=>{
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

    if(orderItems && orderItems.length===0){
        res.status(400).json({ message:"No Order Items" });
    }else{

        Order.create({user: req.user._id , orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice}).then((order)=>{
            console.log('now the order has been created', order);
            res.status(201).json(order);

        }).catch((err)=>{
            console.log('order did not make it', err);
            res.status(401).json({ message: err.message })
        })

    }

})

//Get order by ID

const getOrderById = asyncHandler(async(req,res) =>{

    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if(order){
        res.json(order);
    }else{
        res.status(404).json({ message: 'Order not Found' });
    }
})


//Update order to PAID

const updateOrderToPaid = asyncHandler(async(req,res) =>{

    const order = await Order.findById(req.params.id);
    
    if(order){
        // res.json(order);
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }

        const updatedOrder =  await order.save();

        res.json(updatedOrder);

    }else{
        res.status(404).json({ message: 'Order not Found' });
    }
})


//Get Logged in User Orders
const getMyOrders = asyncHandler(async(req,res) =>{
    const order = await Order.find({ user: req.user._id });
    console.log('mu orders are : ', order);
    res.json(order);
})


export { addOrderItems, getOrderById , updateOrderToPaid, getMyOrders };