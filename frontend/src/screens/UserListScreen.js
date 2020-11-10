import React,{  useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listUsers } from '../actions/userActions';
import { deleteUser } from '../actions/userActions';

const UserListScreen = ({ history }) => {

    const dispatch = useDispatch();

    const userList = useSelector(state=> state.userList)
    const { loading, error, users } = userList;

    const userLogin = useSelector(state=> state.userLogin)
    const {  userInfo } = userLogin;

    const userDelete = useSelector(state=> state.userDelete)
    const { success: successDelete } = userDelete;

    useEffect(()=>{
        if(userInfo && userInfo.isAdmin){
        dispatch(listUsers() )
        }else{
            history.push('/login');
        }
    },[dispatch, history, userInfo, successDelete])
 

    const deleteHandler= (id) =>{
        console.log('deleted usr',id);
        if( window.confirm('Are You Sure? ')){
            dispatch( deleteUser(id) );
        }
    }

    return <div>
        <h1>Users </h1>
        { loading ? <Loader /> : error ? <Message variant="danger" >{error}</Message>
        : <Table responsive hovered striped bordered className="table-sm" >
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>ADMIN</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                { users.map((user)=> {
                    return <tr key={user._id} >
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.isAdmin ? "Admin" : "Not Admin"}</td>
                        <td>
                            <Button variant="danger" className='btn-sm' onClick={()=> deleteHandler( user._id) }  > Delete User </Button>
                        </td>
                    </tr>
                }) }
            </tbody>
        </Table> }
    </div>
}

export default UserListScreen;