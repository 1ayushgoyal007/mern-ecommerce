import React,{ useState } from 'react';
import {  Form, Button} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../actions/cartActions';

const ShippingScreen = ({ history }) => {

    const dispatch = useDispatch();

    const cart = useSelector(state=> state.cart )
    const { shippingAddress } = cart

    const [address, setAddress] = useState(shippingAddress.address);
    const [city,setCity] = useState(shippingAddress.city);
    const [postalCode , setPostalCode]= useState(shippingAddress.postalCode);
    const [country, setCountry] = useState(shippingAddress.country);


    const submitHandler = (e) => {
        e.preventDefault();
        dispatch( saveShippingAddress({ address, city, postalCode, country }) )
        history.push('/payment');
    }

    return <FormContainer>
        <CheckoutSteps step1 step2 />
        <h1>Shipping </h1>
        <Form onSubmit={ submitHandler } >
            <Form.Group controlId="address" >
                <Form.Label>Address</Form.Label>
                <Form.Control 
                    type="text" value={address}
                    placeholder="address" onChange={e=> setAddress(e.target.value) } required> 
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="City" >
                <Form.Label>City</Form.Label>
                <Form.Control 
                    type="text" value={city}
                    placeholder="city" onChange={e=> setCity(e.target.value) } required> 
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="Pin code" >
                <Form.Label>Pin Code</Form.Label>
                <Form.Control 
                    type="text" value={postalCode}
                    placeholder="Pin Code" onChange={e=> setPostalCode(e.target.value) } required> 
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="Country" >
                <Form.Label>Country</Form.Label>
                <Form.Control 
                    type="text" value={country}
                    placeholder="Country" onChange={e=> setCountry(e.target.value) } required> 
                </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={submitHandler} > Continue </Button>
        </Form>
    </FormContainer>
}

export default ShippingScreen