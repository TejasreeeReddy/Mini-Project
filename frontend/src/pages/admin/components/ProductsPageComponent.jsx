import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import AdminLinksComponent from '../../../components/admin/AdminLinksComponent'
import { useDispatch } from 'react-redux'
import { logout } from '../../../redux/actions/userActions'

const ProductsPageComponent = ({ fetchProducts, deleteProduct }) => {
    const [products, setProducts] = useState([])

    const dispatch = useDispatch()

    const deleteHandler = async (productId) => {
        if (window.confirm("are you sure?")) {
            const data = await deleteProduct(productId)
            if (data.message === 'product removed') {
                setProducts((prevPro) => prevPro.filter((pro) => pro._id !== productId))
            }
        }
    }
    useEffect(() => {
        fetchProducts().then((pro) => (
            setProducts(pro)
        )).catch((error) =>{
            dispatch(logout()),
            setProducts([
                { error: error.response?.data?.message ? error.response?.data?.message : error.response?.data }
            ])
        }
        )
    }, [products])
    return (
        <Row className='m-5'>
            <Col md={2}>
                <AdminLinksComponent />
            </Col>
            <Col md={10}>
                <h1>
                    Product List{" "}
                    <LinkContainer to="/admin/create-new-product">
                        <Button variant='primary' size='lg'>create new</Button>
                    </LinkContainer>
                </h1>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Edit/Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>
                                    <LinkContainer to={`/admin/edit-product/${product._id}`}>
                                        <Button className='btn-sm'>
                                            <i className='bi bi-pencil-square'></i>
                                        </Button>
                                    </LinkContainer>
                                    {" / "}
                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
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

export default ProductsPageComponent