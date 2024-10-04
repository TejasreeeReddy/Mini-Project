import React, { useState } from 'react'
import EditUserPageComponent from './components/EditUserPageComponent'
import axios from 'axios'


const AdminEditUserPage = () => {

  const fetchUser = async (userId) => {
    const { data } = await axios.get(`/api/users/${userId}`)
    return data
  }

  const updateUserApiRequest = async (userId, firstName, lastName, email, isAdmin) => {
    const { data } = await axios.put(`/api/users/${userId}`, { firstName, lastName, email, isAdmin });
    return data
  }

  return (
    <EditUserPageComponent updateUserApiRequest={updateUserApiRequest} fetchUser={fetchUser} />
  )
}

export default AdminEditUserPage