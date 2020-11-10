import React,{ useEffect , useState} from 'react';
import {Row, Col, ListGroup, Image, Card, Button} from 'react-bootstrap';
import { PayPalButton } from 'react-paypal-button-v2';
import {Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails , payOrder, deliverOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET , ORDER_DELIVER_RESET} from '../constants/orderConstants'

const OrderScreen = ({ match, history }) => {

    const orderId = match.params.id
    const dispatch = useDispatch();

    
    const orderDetails = useSelector(state=> state.orderDetails);
    const {order, loading, error} = orderDetails;
    
    const userLogin = useSelector(state=> state.userLogin);
    const {userInfo} = userLogin;

    const orderPay = useSelector(state=> state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;

    const orderDeliver = useSelector(state=> state.orderDeliver);
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver;
    
    const floorDigit = (num) => {
        return ( Math.round(num*100) / 100 ).toFixed(2);
    }
    if(!loading){
        order.itemsPrice = floorDigit( order.orderItems.reduce((acc, item)=> acc + item.price* item.qty ,0) );
    }


    const [sdkReady, setSdkReady] = useState(false);
    const [emailVerify, setEmailVerify] = useState(null);
    const [verifyLoader, setVerifyLoader] = useState(true);


    useEffect(()=>{
        if(!userInfo){
            history.push('/login');
        }
        const addPayPalScript = async () => {
            console.log('i am here');
            const { data: clientId } = await axios.get('/api/config/paypal');
            const script = document.createElement('script');
            script.type = "text/javascript"
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true);
            }

            document.body.appendChild(script);

        }

        const verifyHandler =  async () => {
            const { data } = await axios.get(`/api/users/${userInfo._id}`);
            setEmailVerify(data.emailVerified);
            setVerifyLoader(false);
        }

        verifyHandler();

        const checkPayment =  () =>{
            axios.get(`/api/payment/paytm/${orderId}`).then((resp)=>{
                console.log('response',resp.data);
                console.log('response',resp.data.length);
                if(resp.data.length){
                    if(!order.isPaid){
                        dispatch( payOrder(orderId) )
                    }
                }
            }).catch((err)=>{
                console.log('error in fetch',err.message);
            })

        }
        if(!order.isPaid){
            checkPayment();
        }

        if(!order || successPay || successDeliver ){
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })

            dispatch( getOrderDetails( orderId ) )
        }
        else if( !order.isPaid ){
            if(!window.paypal){
                addPayPalScript();
            }else{
                setSdkReady(true);
            }
        }


    },[ dispatch, orderId, successPay, order, successDeliver, history, userInfo ]);


    const deliverHandler = () => {
        dispatch( deliverOrder(order) );
    }

    const successPaymentHandler = ( paymentResult ) => {
        dispatch( payOrder(orderId, paymentResult) )
    }

    const PaytmHandler =  (e) => {
        e.preventDefault();
        const data = {
            amount:parseInt(order.totalPrice),
            orderId: orderId,
            userId: userInfo._id
        }
        axios.post('http://localhost:5050/payment',data).then((res)=>{
            console.log('post done', res);
        }).catch((err)=>{
            console.log('post not done', err.message);
        })
    }

    return loading ? <Loader /> : error ? <Message variant="danger" >{error}</Message> : <>
    <h1>Order {order._id}</h1>
    <Row> 
            <Col md={8} >
                <ListGroup variant="flush" >
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p style={{display:'flex', flexDirection:'column'}} >
                            <strong>Name:</strong> { order.user.name } 
                            <strong>Email:</strong> { order.user.email } 
                            <strong> Address: </strong>
                            {`${order.shippingAddress.address} ${order.shippingAddress.city} ${order.shippingAddress.postalCode} ${order.shippingAddress.country}`}
                        </p>
                        { order.isDelivered ? <Message variant="success" > Delivered at {order.deliveredAt} </Message> :
                        <Message variant="danger" >
                            Not Delivered
                        </Message> }
                    </ListGroup.Item>
s
                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p> 
                            <strong>Method: </strong> {order.paymentMethod}
                        </p>
                        { order.isPaid ? <Message variant="success" > Paid at {order.paidAt} </Message> :
                        <Message variant="danger" >
                            Not Paid
                        </Message> }
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order items</h2>
                        { order.orderItems.length===0 ? <Message variant="danger" >Order is Empty</Message>
                        : <ListGroup variant="flush" >
                            { order.orderItems.map((item, index)=>{
                                return <ListGroup.Item key={index} >
                                    <Row>
                                        <Col md={1}>
                                            <Image src={ item.image } alt={item.name} fluid  />
                                        </Col>
                                        <Col>
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={4} >
                                            {item.qty } X ${item.price} = ${ floorDigit( item.qty * item.price )}
                                        </Col>

                                    </Row>
                                </ListGroup.Item>
                            }) }
                        </ListGroup> }
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup>
                        <ListGroup.Item>
                            <h2>Price Summary</h2>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row> 
                                <Col>Items</Col>
                                <Col>INR {order.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping</Col>
                                <Col>INR {order.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>GST </Col>
                                <Col>INR {order.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Row>
                                <Col>Total</Col>
                                <Col>INR {order.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        { !order.isPaid ? <ListGroup.Item>
                            { loadingPay ? <Loader /> : null}
                            { verifyLoader ? <Loader /> : !emailVerify ?
                             <Link to="/verifyAccount" ><Button variant="dark" >Let's Verify Email First</Button></Link>
                              :  !sdkReady ? <Loader /> 
                              : <div>
                                  <PayPalButton currency="INR" amount={ parseInt( order.totalPrice )} onSuccess={successPaymentHandler} />
                                  <div>
                                      <form action="http://localhost:5050/payment" method="POST" >
                                          <input type="hidden" name="amount" value={ parseInt( order.totalPrice )} />
                                          <input type="hidden" name="orderId" value={orderId} />
                                          <input type="hidden" name="userId" value={userInfo._id} />
                                          <Button variant="info" type="submit" >Pay with Paytm</Button>
                                      </form>
                                  </div>
                                </div> } 
                        </ListGroup.Item> : null }
                        { loadingDeliver ? <Loader /> : null }
                        { ( userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered) ? <ListGroup.Item>
                            <Button type="button" className='btn btn-block' onClick={deliverHandler} > Mark as Delivered </Button>
                        </ListGroup.Item>:null }
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
}

export default OrderScreen;