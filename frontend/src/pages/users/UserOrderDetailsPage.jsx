import React from 'react'
import UserOrderDetailsPageComponent from './components/UserOrderDetailsPageComponent'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { loadScript } from "@paypal/paypal-js"

const UserOrderDetailsPage = () => {
  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo.userInfo)

  const getUser = async () => {
    const { data } = await axios.get("/api/users/profile/" + userInfo._id)
    // console.log(data)
    return data
  }

  const getOrder = async (orderId) => {
    const { data } = await axios.get("/api/orders/user/" + orderId);
    return data
  }

  const loadPayPalScript = (cartSubTotal, cartItems,updateStateAfterOrder,orderId) => {
    loadScript({ "client-id": "AVxSRbJKE5vpqS8VZUYIk3Ryfa-Rv5L9BViNME_nQqFdtyrA1U2P3Kiavssu3-7m_zQcf1kuHroQcOQN" })
      .then(paypal => {
        // console.log(paypal)
        paypal.Buttons(buttons(cartSubTotal, cartItems,updateStateAfterOrder,orderId)).render("#paypal-container-element")
      })
      .catch(err => {
        console.error("failed to load the paypal is sdk script", err)
      })
  }

  // const createPayPalOrderHandler = function () {
  //   console.log("createPayPalOrderHandler")
  // }

  const onCancelHandler = function () {
    console.log("onCancelHandler")
  }

  const onApproveHandler = function () {
    console.log("onApproveHandler")
  }

  const onErrorHandler = function () {
    console.log("onErrorHandler")
  }


  const buttons = (cartSubTotal, cartItems,updateStateAfterOrder,orderId) => {
    return {
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: cartSubTotal,
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: cartSubTotal,
                  }
                }
              },
              items: cartItems.map(product => {
                return {
                  name: product.name,
                  unit_amount: {
                    currency_code: "USD",
                    value: product.price,
                  },
                  quantity: product.quantity
                }
              })
            }
          ]
        });
      },
      onCancel: onCancelHandler,
      onApprove: function (data,actions){
        return actions.order.capture().then(function (orderData){
          // console.log(orderData)
          var transaction = orderData.purchase_units[0].payments.captures[0];
          if(transaction.status === "COMPLETED" && Number(transaction.amount.value)===Number(cartSubTotal)){
            updateOrder(orderId)
            .then(data=>{
              if(data.isPaid){
                updateStateAfterOrder(data.paidAt)
              }
            })
            .catch((error)=>console.log(error))
          }
        })
      },
      onError: onErrorHandler
    }
  }

  const updateOrder = async(orderId)=>{
    const {data} = await axios.put("/api/orders/paid/" + orderId);
    return data
  }
  return (
    <UserOrderDetailsPageComponent userInfo={userInfo} getUser={getUser} getOrder={getOrder} loadPayPalScript={loadPayPalScript} />
  )
}

export default UserOrderDetailsPage