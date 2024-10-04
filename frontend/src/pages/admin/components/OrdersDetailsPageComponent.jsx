import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Container, Form, ListGroup, Row } from 'react-bootstrap'
import CartItemComponent from '../../../components/user/CartItemComponent'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../../redux/actions/userActions'

const OrdersDetailsPageComponent = ({ getOrder, markAsDelivered }) => {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState({})
    const [paymentMethod, setPaymentMethod] = useState("")
    const [isPaid, setIsPaid] = useState(false)
    const [isDelivered, setIsDelivered] = useState(false)
    const [cartSubTotal, setCartSubTotal] = useState(0)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [orderButtonMessage, setOrderButtonMessage] = useState('Mark as delivered')
    const [cartItems, setCartItems] = useState([])

    const dispatch = useDispatch()

    useEffect(() => {
        getOrder(id)
            .then((order) => {
                console.log(order)
                setUserInfo(order.user);
                setPaymentMethod(order.paymentMethod);
                order.isPaid ? setIsPaid(order.paidAt) : setIsPaid(false);
                order.isDelivered ? setIsDelivered(order.deliveredAt) : setIsDelivered(false);
                setCartSubTotal(order.orderTotal.cartSubTotal)
                if (order.isDelivered) {
                    setOrderButtonMessage("Order is finished")
                    setButtonDisabled(true)
                }
                setCartItems(order.cartItems)
            })
            .catch((error) => {
                dispatch(logout())
                // console.log(
                //     error.response.data.message ? error.response.data.message : error.response.data
                // )
            })
    }, [isDelivered, id])

    console.log(userInfo)
    return (
        <Container fluid>
            <Row className='mt-4'>
                <h1>Order Details</h1>
                <Col md={8}>
                    <br />
                    <Row>
                        <Col md={6}>
                            <h2>Shipping</h2>
                            <b>Name</b>: {userInfo.name}  {userInfo.lastName} <br />
                            <b>Address</b>: {userInfo.address} {userInfo.city} {userInfo.state} {userInfo.zipCode}<br />
                            <b>Phone</b>: {userInfo.phoneNumber}
                        </Col>
                        <Col md={6}>
                            <h2>Payment method</h2>
                            <Form.Select value={paymentMethod} disabled={true}>
                                <option value="pp">PayPal</option>
                                <option value="cod">Cash on Delivery( delivary may be delayed)</option>
                            </Form.Select>
                        </Col>
                        <Row>
                            <Col>
                                <Alert className='mt-3' variant={isDelivered ? "success" : "danger"}>
                                    {isDelivered ? <>Delivered at {isDelivered}</> : <>Not delivered</>}
                                </Alert>
                            </Col>
                            <Col>
                                <Alert className='mt-3' variant={isPaid ? "success" : "danger"}>
                                    {isPaid ? <>Paid on {isPaid}</> : <>Not paid yet</>}
                                </Alert>
                            </Col>
                        </Row>
                    </Row>
                    <br />
                    <h2>Order items</h2>
                    <ListGroup variant='flush'>
                        {cartItems.map((item, index) => (
                            <CartItemComponent key={index} item={item} orderCreated={true} />
                        ))}
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <ListGroup>
                        <ListGroup.Item>
                            <h3>Order Summary</h3>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Items price (after tax): <span className='fw-bold'>$ {cartSubTotal}</span>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Shipping: <span className='fw-bold'>included</span>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Tax: <span className='fw-bold'>included</span>
                        </ListGroup.Item>
                        <ListGroup.Item className='text-danger'>
                            Total Price: <span className='fw-bold'>$ {cartSubTotal}</span>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <div className='d-grid gap-2'>
                                <Button
                                    disabled={buttonDisabled}
                                    variant='danger'
                                    size='lg'
                                    type='button'
                                    onClick={() => markAsDelivered(id).then((res) => {
                                        if (res) {
                                            setIsDelivered(true)
                                        }
                                    })
                                    .catch((error)=>{
                                        console.log(error.response.data.message ? error.response.data.message : error.response.data)
                                    })}
                                >
                                    {orderButtonMessage}
                                </Button>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )
}

export default OrdersDetailsPageComponent