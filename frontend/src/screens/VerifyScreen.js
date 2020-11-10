import axios from 'axios';
import React, { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
const VerifyScreen = () => {

    const userLogin = useSelector(state=> state.userLogin)
    const {  userInfo } = userLogin;



    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [verify, setVerify] = useState(null);
    const [emailLoader, setEmailLoader] = useState(true);



    useEffect(()=>{
        const checkVerified = async () => {
            try{
                const { data } = await axios.get(`/api/users/${userInfo._id}`);
                setVerify(data.emailVerified);
                setEmailLoader(false);
            }catch(err){
                console.log('error',err);
                setEmailLoader(false);
            }
        }
        checkVerified();
    },[verify, userInfo]);

    const  verifyHandler = async () =>{
        setLoading(true);
        try{
            const { data } = await axios.get(`/api/verify/${userInfo._id}`);
            setMessage('Verification link has been sent to registered email');
            setLoading(false);
        }catch(err){
            setMessage(err.message);
            setLoading(false);
        }
    }


    return <div>
        { message.length ? <Message variant="info" >{message}</Message> : null}
        <div className="verify-btn" >
            { loading? <Loader /> 
            :  emailLoader ? <Loader /> : verify ? <h1>Email Already Verified</h1> : <Button variant="dark" onClick = {verifyHandler} >Click Here to Verify</Button>}
        </div>


    </div>
}

export default VerifyScreen;