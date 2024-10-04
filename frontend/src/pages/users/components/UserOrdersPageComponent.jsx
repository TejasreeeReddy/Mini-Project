import React, { useEffect, useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const UserOrdersPageComponent = ({getOrders}) => {
    // getOrders().then(orders=>console.log(orders))
    const [orders, setOrders] = useState([]);
    useEffect(()=>{
        getOrders()
        .then(orders=>setOrders(orders))
        .catch((error)=>console.log(error))
    },[])
  return (
    <Row className='m-5'>
    <Col md={12}>
      <h1>My Orders</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Date</th>
            <th>Total</th>
            <th>Delivered</th>
            <th>Order details</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>You</td>
              <td>{order.createdAt.substring(0,10)}</td>
              <td>{order.orderTotal.cartSubTotal}</td>
              <td>
                {order.isDelivere ? <i className='bi bi-check-lg text-success'></i> : <i className='bi bi-x-lg text-danger'></i>}
              </td>
              <td>
                <Link to={`/user/order-details/${order._id}`}>go to order</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Col>
  </Row>
  )
}

export default UserOrdersPageComponent