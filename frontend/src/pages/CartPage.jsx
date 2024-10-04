import React from 'react'
import CartPageComponent from './components/CartPageComponent'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart } from '../redux/actions/cartActions';

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartSubTotal = useSelector((state) => state.cart.cartSubTotal)
  const reduxDispatch = useDispatch()


  return (
    <CartPageComponent addToCart={addToCart} removeFromCart={removeFromCart} cartItems={cartItems} cartSubTotal={cartSubTotal} reduxDispatch={reduxDispatch} />
  )
}

export default CartPage