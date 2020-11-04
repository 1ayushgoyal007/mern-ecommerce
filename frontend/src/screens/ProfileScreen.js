import React,{ useState, useEffect } from 'react';
import { Row, Col, Form, Button, Table  } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';


const ProfileScreen = ({ location, history }) => {

    const [name, setName] = useState('');
    const [email, setEmail]= useState('');

    const dispatch = useDispatch();

    const userDetails = useSelector(state => state.userDetails )
    const { loading, error, user } = userDetails ;

    const userLogin = useSelector(state => state.userLogin )
    const { userInfo } = userLogin ;

    const userUpdateProfile = useSelector( state => state.userUpdateProfile );
    const { success } = userUpdateProfile;

    const orderListMy = useSelector(state => state.orderListMy )
    const { loading :loadingOrders, error: errorOrders, orders } = orderListMy ;

    useEffect(()=>{
        if(!userInfo){
            history.push('/login');
        }else{
            if(!user.name){
                dispatch( getUserDetails('profile') )
                dispatch( listMyOrders() )
            }else{
                setName(user.name);
                setEmail(user.email)
            }
        }
    },[history, userInfo, dispatch, user])

    const submitHandler = (e) => {
        e.preventDefault();
        console.log('submit');
    }

    return <Row>
        <Col md={3} >
            <h1>Profile </h1>
            { error ? <Message variant="danger" >  {error} </Message>: null }
            { success ? <Message variant="success" >Profile Updated </Message>: null }
            {loading? <Loader /> : null}
            <Form onSubmit={submitHandler} >
            <Form.Group controlId="name" >
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control 
                        disabled={true}
                        type="text" value={name}
                        placeholder="Full Name" onChange={e=> setName(e.target.value) } > 
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="email" >
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        disabled={true}
                        type="email" value={email}
                        placeholder="Email" onChange={e=> setEmail(e.target.value) } > 
                    </Form.Control>
                </Form.Group>
                
            </Form>
        </Col>
        <Col md={9} >
            <h2>My Orders</h2>
            { loadingOrders ? <Loader /> : errorOrders ? <Message variant="danger" >{errorOrders}</Message>
            : <Table striped responsive bordered hover className="table-sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Paid</th>
                        <th>Delivered</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    { orders.map((order)=> {
                        return <tr key={ order._id } >
                            <td>{order._id } </td>
                            <td>{order.createdAt.substring(0,10)  } </td>
                            <td>{order.totalPrice } </td>
                            <td>{order.isPaid ? "paid" : "not Paid" } </td>
                            <td>{order.isDelivered ? "Delivered" : "not Delivered" } </td>
                            <td>
                                <LinkContainer to={`/order/${order._id}`} >
                                    <Button className="btn-sm" variant="light" > More Info </Button>
                                </LinkContainer>
                            </td>
                        </tr>
                    } ) }
                </tbody>
            </Table> }
        </Col>
    </Row>
} 

export default ProfileScreen;