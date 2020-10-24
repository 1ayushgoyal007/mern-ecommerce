import React,{ useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { updateUserProfile, getUserDetails } from '../actions/userActions';



const ProfileScreen = ({ location, history }) => {

    const [name, setName] = useState('');
    const [email, setEmail]= useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();

    const userDetails = useSelector(state => state.userDetails )
    const { loading, error, user } = userDetails ;

    const userLogin = useSelector(state => state.userLogin )
    const { userInfo } = userLogin ;

    const userUpdateProfile = useSelector( state => state.userUpdateProfile );
    const { success } = userUpdateProfile;

    useEffect(()=>{
        if(!userInfo){
            history.push('/login');
        }else{
            if(!user.name){
                dispatch( getUserDetails('profile') )
            }else{
                setName(user.name);
                setEmail(user.email)
            }
        }
    },[history, userInfo, dispatch, user])

    const submitHandler = (e) => {
        e.preventDefault();
        console.log('submit');

        if(password !== confirmPassword){
            setMessage('Password and confirm password should be same.')
        }else{
        setMessage(null);
        dispatch( updateUserProfile({ id: user._id , name, email , password  }) )
        }
    }

    return <Row>
        <Col md={3} >
            <h1>Profile </h1>
            { error ? <Message variant="danger" >  {error} </Message>: null }
            { message ? <Message variant="danger" >{message} </Message>: null }
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
        </Col>
    </Row>
} 

export default ProfileScreen;