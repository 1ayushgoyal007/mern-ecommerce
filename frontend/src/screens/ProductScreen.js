import React,{ useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {useDispatch, useSelector} from 'react-redux';
import {Row, Col, Card, Button, Image, ListGroup, Form} from 'react-bootstrap';
import Rating from '../components/Rating';
import { listProductDetails } from '../actions/productActions';



const ProductScreen = ({ history,match }) =>{

    const [qty, setQty] = useState(1);



    const dispatch = useDispatch();
    const productDetails = useSelector(state => state.productDetails);

    const { error, product, loading } = productDetails;

    useEffect(()=>{
        
        dispatch(listProductDetails(match.params.id))

    },[dispatch, match]);


    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }


    return <div>
        <Link className="btn btn-light my-3" to="/" >Go back</Link>
        { loading? <Loader /> :error ? <Message variant="danger" >{error}</Message> : <Row>
            <Col md={6} >
                <Image fluid src={product.image} alt={product.name} />
            </Col>
            <Col md={3} >
                <ListGroup variant="flush" >
                    <ListGroup.Item>
                        <h2>{product.name}</h2>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Rating value={product.rating} text={product.numReviews} />
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Price: ${product.price}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        Description: ${product.description}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={3} >
                <Card>
                    <ListGroup variant="flush" >
                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    Price: 
                                </Col>
                                <Col>
                                    <strong>${product.price}</strong>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>
                                    Status: 
                                </Col>
                                <Col>
                                {product.countInStock > 0 ? 'In Stock': 'Out of Stock'}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                        { product.countInStock > 0 && ( 
                            <ListGroup.Item>
                                <Row>
                                    <Col>Qty</Col>
                                    <Col>
                                        <Form.Control as="select" value={qty} onChange={(e)=> {
                                            setQty(e.target.value)
                                            console.log(qty);
                                        }  } >
                                            
                                            { [...Array(product.countInStock).keys() ].map(x=>{
                                                return <option key={x+1} value={x+1} >
                                                    {x+1}
                                                </option>
                                            })  }
                                        </Form.Control>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        )  }

                        <ListGroup.Item>
                            <Button onClick={addToCartHandler}  className="btn-block" type="button" disabled={product.countInStock === 0} >
                                { product.countInStock ===0 ? "Out Of Stock" : "Add To Cart" }
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>}
    </div>
}

export default ProductScreen;