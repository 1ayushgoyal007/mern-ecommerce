import React,{ useEffect} from 'react';
import {Row, Col} from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';

const HomeScreen =  ({ match }) =>{

    const dispatch = useDispatch()
    const keyword = match.params.keyword 
    const pageNumber = match.params.pageNumber || 1

    // const [products, setProducts]  = useState([]);

    const productList = useSelector(state=> state.productList )
    const { products, error, loading, pages, page } = productList

    useEffect(()=>{
        dispatch(listProducts( keyword, pageNumber ));

    },[dispatch, keyword, pageNumber]);

    return <div>
        <Meta  />
        <h1>Latest Products</h1>
        { loading? <Loader />: error ? <Message>{error}</Message>
         : <>
         <Row>
            {products.map( (product)=>{
                return <Col key={product._id} sm={12} md={6} lg={4} xl={3} >
                <Product product={product} />
                </Col>
            } )}
        </Row>
        <Paginate pages={pages} page={page} keyword={ keyword ? keyword:''}  />
        </>}
        
    </div>
}

export default HomeScreen;