import React,{ useEffect} from 'react';
import {Row, Col} from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';

const HomeScreen =  () =>{

    const dispatch = useDispatch()

    // const [products, setProducts]  = useState([]);

    const productList = useSelector(state=> state.productList )
    const { products, error, loading } = productList

    useEffect(()=>{
        dispatch(listProducts());

    },[dispatch]);

    return <div>
        <h1>Latest Products</h1>
        { loading? <Loader />: error ? <Message>{error}</Message> : <Row>
            {products.map( (product)=>{
                return <Col key={product._id} sm={12} md={6} lg={4} xl={3} >
                <Product product={product} />
                </Col>
            } )}
        </Row>}
        
    </div>
}

export default HomeScreen;