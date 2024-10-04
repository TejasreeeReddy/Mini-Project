import React from 'react'
import { Alert, Button, Col, Container, ListGroup, Row } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import CartItemComponent from '../../components/user/CartItemComponent'

const CartPageComponent = ({ addToCart, cartItems, cartSubTotal, reduxDispatch, removeFromCart }) => {
    // console.log(cartItems )
    const changeCout = (productId, count) => {
        reduxDispatch(addToCart(productId, count))
    }

    const removeFromCartHandler = (productId,quantity,price)=>{
        if(window.confirm("Are you sure?")){
            // console.log(productId)
            // console.log(quantity)
            // console.log(price)
            reduxDispatch(removeFromCart(productId,quantity,price))

        }
    }


    return (
        <Container fluid>
            <Row className='mt-4'>
                <Col md={8}>
                    <h1>Shopping cart</h1>
                    {cartItems.length === 0 ? (
                        <Alert variant='info'>your cat is empty</Alert>
                    ) : (
                        <ListGroup variant="flush">
                            {cartItems.map((item, index) => (
                                <CartItemComponent item={item} key={index} changeCout={changeCout} removeFromCartHandler = {removeFromCartHandler} />
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    <ListGroup>
                        <ListGroup.Item>
                            <h3>SubTotal ({cartItems.length} {cartItems.length === 1 ? "Product" : "Products"})</h3>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Price: <span className='fw-bold'>$ {cartSubTotal}</span>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <LinkContainer to='/user/cart-details'>
                                <Button disabled={cartSubTotal === 0} className='button'>proceed to checkOut</Button>
                            </LinkContainer>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )
}

export default CartPageComponent