import React,{ useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { register } from '../actions/userActions';



const RegisterScreen = ({ location, history }) => {

    const [name, setName] = useState('');
    const [email, setEmail]= useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);

    const redirect = location.search ? location.search.split('=')[1] : '/';
    const dispatch = useDispatch();

    const userRegister = useSelector(state => state.userRegister )

    const { loading, error, userInfo } = userRegister;

    useEffect(()=>{
        if(userInfo){
            history.push(redirect);
        }
    },[history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault();
        console.log('submit');

        if(password !== confirmPassword){
            setMessage('Password and confirm password should be same.')
        }else{
        setMessage(null);
        dispatch( register(name, email,password) );
        }
    }

    return <FormContainer>
        <h1>Create New Account </h1>
        { error ? <Message variant="danger" >  {error} </Message>: null }
        { message ? <Message variant="danger" >{message} </Message>: null }
        {loading? <Loader /> : null}
        <Form onSubmit={submitHandler} >
        <Form.Group controlId="name" >
                <Form.Label>Full Name</Form.Label>
                <Form.Control 
                    type="text" value={name}
                    placeholder="Full Name" onChange={e=> setName(e.target.value) } > 
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="email" >
                <Form.Label>Email Address</Form.Label>
                <Form.Control 
                    type="email" value={email}
                    placeholder="Email" onChange={e=> setEmail(e.target.value) } > 
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="password" >
                <Form.Label>password</Form.Label>
                <Form.Control 
                    type="password" value={password}
                    placeholder="password" onChange={e=> setPassword(e.target.value) } > 
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="confirm password" >
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                    type="password" value={confirmPassword}
                    placeholder="confirm password" onChange={e=> setConfirmPassword(e.target.value) } > 
                </Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" disabled={ !name || !email || !password || !confirmPassword }  > Sign Up</Button>
        </Form>

        <Row className="py-3" >
            <Col>
            Already a user? ? <Link to={ redirect?  `/login?redirect=${redirect}` : '/login' } >
             Sign In
            </Link>
            </Col>
        </Row>
    </FormContainer>
}

export default RegisterScreen;