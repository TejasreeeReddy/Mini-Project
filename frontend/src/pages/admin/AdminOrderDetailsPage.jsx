import React from 'react'
import OrdersDetailsPageComponent from './components/OrdersDetailsPageComponent'
import axios from 'axios'


const AdminOrderDetailsPage = () => {

  const getOrder = async (id) => {
    const { data } = await axios.get("/api/orders/user/" + id);
    return data
  }

  const markAsDelivered = async (id) => {
    const { data } = await axios.put("/api/orders/delivered/" + id);
    if(data){
      return data
    }
  }

  return (
    <OrdersDetailsPageComponent getOrder={getOrder} markAsDelivered={markAsDelivered} />
  )
}

export default AdminOrderDetailsPage