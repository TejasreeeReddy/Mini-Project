import React, { useEffect, useState } from 'react'
import AdminLinksComponent from '../../../components/admin/AdminLinksComponent'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../../redux/actions/userActions'


const UsersPageComponent = ({ fetchUsers,deleteUser }) => {
    // console.log("api data",fetchUsers)
    const [users, setUsers] = useState([])
    // const [userDeleted, setUserDeleted] = useState(false)

    const dispatch = useDispatch()

    const deleteHandler = async (userId) => {
        if (window.confirm("Are you sure!")) {
            const data = await deleteUser(userId)
            if(data === "user removed"){
                setUsers((prevUsers)=>prevUsers.filter((user)=>user._id!==userId))
            }
        }
    }

    useEffect(()=>{
        fetchUsers
        .then((res)=>setUsers(res))
        .catch((error)=>
            dispatch(logout())
            // console.log(
            //     error.response.data.message ? error.response.data.message : error.response.data
            // )
        )
    },[])
    return (
        <Row className='m-5'>
            <Col md={2}>
                <AdminLinksComponent />
            </Col>
            <Col md={10}>
                <h1>Users List</h1>
                {console.log(users)}
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>isAdmin</th>
                            <th>Edir/Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.isAdmin ? <i className='bi bi-check-lg text-success'></i>:<i className='bi bi-x-lg text-danger'></i>}
                                </td>
                                <td>
                                    <LinkContainer to={`/admin/edit-user/${user._id}`}>
                                        <Button className='btn-sm'>
                                            <i className='bi bi-pencil-square'></i>
                                        </Button>
                                    </LinkContainer>
                                    {" / "}
                                    <Button variant='danger' className='btn-sm' onClick={()=>deleteHandler(user._id)}>
                                        <i className='bi bi-x-circle'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
        </Row>
    )
}

export default UsersPageComponent