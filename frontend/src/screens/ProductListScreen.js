import React,{  useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import { listProducts, deleteProduct, createProduct } from '../actions/productActions';
import  { PRODUCT_CREATE_RESET } from '../constants/productConstants';
const ProductListScreen = ({ history, match }) => {

    const pageNumber = match.params.pageNumber || 1
    const dispatch = useDispatch();

    const productList = useSelector(state=> state.productList)
    const { loading, error, products, pages, page } = productList;

    const productDelete = useSelector(state=> state.productDelete)
    const { loading: loadingDelete, error:errorDelete, success: successDelete } = productDelete;

    const productCreate = useSelector(state=> state.productCreate)
    const { loading: loadingCreate, error:errorCreate, success: successCreate, product: createdProduct } = productCreate;

    const userLogin = useSelector(state=> state.userLogin)
    const {  userInfo } = userLogin;

    useEffect(()=>{
        dispatch({ type:PRODUCT_CREATE_RESET })
        
        if(!userInfo.isAdmin ){
            history.push('/login');
        }

        if(successCreate){
            history.push(`/admin/product/${createdProduct._id}/edit`)
        }else{
            dispatch( listProducts('',pageNumber) )
        }

    },[dispatch, history, userInfo, successDelete, successCreate, createdProduct, pageNumber   ])
 

    const deleteHandler= (id) =>{
        console.log('deleted usr',id);
        if( window.confirm('Are You Sure? ')){
            // dispatch( deleteUser(id) );
            dispatch( deleteProduct(id) );
        }
    }

    const createProductHandler = (product) => {
        console.log('create product');
        dispatch( createProduct() )
    }

    return <div>
        <Row className='align-items-center' >
            <Col>
                <h1>Products</h1>
            </Col>
            <Col className="text-right" >
                <Button className='my-3' onClick={createProductHandler} > Create Product</Button>
            </Col>
        </Row>
        { loadingDelete ? <Loader /> : errorDelete ? <Message variant="danger" >{errorDelete}</Message>:null }
        { loadingCreate ? <Loader /> : errorCreate ? <Message variant="danger" >{errorCreate}</Message>:null }
        { loading ? <Loader /> : error ? <Message variant="danger" >{error}</Message>
        : <><Table responsive hovered striped bordered className="table-sm" >
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>PRICE</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                { products.map((product)=> {
                    return <tr key={product._id} >
                        <td>{product._id}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.category}</td>
                        <td>{product.brand}</td>
                        <td  >
                            <LinkContainer to={`/admin/product/${product._id}/edit`} className="my-3" style= {{margin:5}} >
                                <Button variant="dark"className="btn-sm"  > 
                                <i className="fas fa-edit"   ></i>
                                </Button>
                            </LinkContainer>
                            <Button variant="danger" className="btn-sm my-3"   onClick={()=> deleteHandler( product._id) } > <i className="fas fa-trash" ></i> </Button>
                        </td>
                    </tr>
                }) }
            </tbody>
        </Table>
        <Paginate pages={pages} page={page} isAdmin={true} />
        </> }
    </div>
}

export default ProductListScreen;