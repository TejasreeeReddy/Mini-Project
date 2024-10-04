import React, { useEffect, useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import AdminLinksComponent from '../../../components/admin/AdminLinksComponent'
import { useDispatch } from 'react-redux'
import { logout } from '../../../redux/actions/userActions'

const OrdersPageComponent = ({ getOrders }) => {
    const [orders, setOrders] = useState([])

    const dispatch = useDispatch()

    useEffect(() => {
        getOrders()
            .then((res) => setOrders(res))
            .catch((error) => {
                dispatch(logout())
                // console.log(
                //     error.response.data.message ? error.response.data.message : error.response.data
                // )
            })
    }, [])
    // console.log(orders)
    return (
        <Row className='m-5'>
            <Col md={2}>
                <AdminLinksComponent />
            </Col>
            <Col md={10}>
                <h1>Orders</h1>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Delivered</th>
                            <th>Payment method</th>
                            <th>Order details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{order.user !== null ? (
                                    <>
                                        {order.user.name} {order.user.lastName}
                                    </>
                                ) : null}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>{order.orderTotal.cartSubTotal}</td>
                                <td>
                                    {order.isDelivered ? <i className='bi bi-check-lg text-success'></i> : <i className='bi bi-x-lg text-danger'></i>}
                                </td>
                                <td>{order.paymentMethod}</td>
                                <td>
                                    <Link to={`/admin/order-details/${order._id}`}>go to order</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
        </Row>
    )
}

export default OrdersPageComponent