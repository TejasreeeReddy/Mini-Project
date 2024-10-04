import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from './pages/HomePage'
import ProductListPage from './pages/ProductListPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoutesComponent from './components/ProtectedRoutesComponent'
import UserProfilePage from './pages/users/UserProfilePage'
import UserOrdersPage from './pages/users/UserOrdersPage'
import UserCartDetailsPage from './pages/users/UserCartDetailsPage'
import UserOrderDetailsPage from './pages/users/UserOrderDetailsPage'
import AdminUserPage from './pages/admin/AdminUserPage'
import AdminEditUserPage from './pages/admin/AdminEditUserPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminCreateProductPage from './pages/admin/AdminCreateProductPage'
import AdminEditProductPage from './pages/admin/AdminEditProductPage'
import AdminOrderDetailsPage from './pages/admin/AdminOrderDetailsPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminChatsPage from './pages/admin/AdminChatsPage'
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage'
import HeaderComponent from './components/HeaderComponent'
import FooterComponent from './components/FooterComponent'
import RoutesWithUserChatComponent from './components/user/RoutesWithUserChatComponent'
import ScrollToTop from './utils/ScrollToTop'
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <ScrollToTop />
        <HeaderComponent />
        <Routes>
          <Route element={<RoutesWithUserChatComponent />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/product-list' element={<ProductListPage />} />
            <Route path='/product-list/:pageNumParam' element={<ProductListPage />} />
            <Route path='/product-list/category/:categoryName' element={<ProductListPage />} />
            <Route path='/product-list/category/:categoryName/:pageNumParam' element={<ProductListPage />} />
            <Route path='/product-list/search/:searchQuery' element={<ProductListPage />} />
            <Route path='/product-list/search/:searchQuery/:pageNumParam' element={<ProductListPage />} />
            <Route path='/product-list/catgeory/:categoryName/search/:searchQuery' element={<ProductListPage />} />
            <Route path='/product-list/catgeory/:categoryName/search/:searchQuery/:pageNumParam' element={<ProductListPage />} />

            {/* Login pages components */}
            <Route path='/product-details/:id' element={<ProductDetailsPage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='*' element="page not exits 404" />
          </Route>
           {/* User Order details components */}
          <Route element={<ProtectedRoutesComponent admin={false} />}>
            <Route path='/user' element={<UserProfilePage />} />
            <Route path='/user/my-orders' element={<UserOrdersPage />} />
            <Route path='/user/cart-details' element={<UserCartDetailsPage />} />
            <Route path='/user/order-details/:id' element={<UserOrderDetailsPage />} />
          </Route>
            {/* Admin page components */}
          <Route element={<ProtectedRoutesComponent admin={true} />}>
            <Route path='/admin/users' element={<AdminUserPage />} />
            <Route path='/admin/edit-user/:id' element={<AdminEditUserPage />} />
            <Route path='/admin/products' element={<AdminProductsPage />} />
            <Route path='/admin/create-new-product' element={<AdminCreateProductPage />} />
            <Route path='/admin/edit-product/:id' element={<AdminEditProductPage />} />
            <Route path='/admin/order-details/:id' element={<AdminOrderDetailsPage />} />
            <Route path='/admin/orders' element={<AdminOrdersPage />} />
            <Route path='/admin/chats' element={<AdminChatsPage />} />
            <Route path='/admin/analytics' element={<AdminAnalyticsPage />} />
          </Route>
        </Routes>
        <FooterComponent />
      </BrowserRouter>
    </div>
  )}

export default App