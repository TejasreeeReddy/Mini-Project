import React from 'react'
import UsersPageComponent from './components/UsersPageComponent'
import axios from 'axios'
const AdminUserPage = () => {
  const fetchUsers = async()=>{
    const {data} = await axios.get("/api/users") //destructuring
    console.log(data)
    return data
  }


  const deleteUser = async(userId)=>{
    const {data} = await axios.delete(`/api/users/${userId}`)
    return data
  }
  return (
    <UsersPageComponent fetchUsers = {fetchUsers()} deleteUser={deleteUser} />
  )
}

export default AdminUserPage