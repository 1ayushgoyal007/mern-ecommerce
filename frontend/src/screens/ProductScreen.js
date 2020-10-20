import React,{ useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import {Row, Col, Card, Button, Image, ListGroup} from 'react-bootstrap';
import Rating from '../components/Rating';
import axios from 'axios';

const ProductScreen = ({ match }) =>{

    const [product, setProduct] = useState({});

    useEffect(()=>{
        const fetchProduct = async () => {
            const res = await axios.get(`/api/products/${match.params.id}`);
            setProduct(res.data);
        }
        fetchProduct();
    },[]);


    return <div>
        <Link className="btn btn-light my-3" to="/" >Go back</Link>
        <Row>
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
                        <ListGroup.Item>
                            <Button  className="btn-block" type="button" disabled={product.countInStock === 0} >
                                Add To cart
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </div>
}

export default ProductScreen;