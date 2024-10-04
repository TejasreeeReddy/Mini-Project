import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Container, Form, Row, } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'

const EditUserPageComponent = ({ updateUserApiRequest, fetchUser }) => {
    const [validated, setValidated] = useState(false);
    const [user, setUser] = useState([]);
    const [isAdminState, setIsAdminState] = useState(false);
    const [updateUserResponseState, setUpdateUserResponseState] = useState({
        message: "", error: ""
    })

    const { id } = useParams();
    const navigate = useNavigate();


    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget.elements;
        const firstName = form.firstName.value;
        const lastName = form.lastName.value;
        const email = form.email.value;
        const isAdmin = form.isAdmin.checked;
        if (event.currentTarget.checkValidity() === true) {
            updateUserApiRequest(id, firstName, lastName, email, isAdmin)
                .then((data) => {
                    if (data === "user updated") {
                        navigate("/admin/users")
                    }
                })
                .catch((error) => {
                    setUpdateUserResponseState({ error: error.response.data.message ? error.response.data.message : error.response.data })
                })
        }

        setValidated(true);
    };

    useEffect(() => {
        fetchUser(id)
            .then(data => {
                setUser(data);
                setIsAdminState(data.isAdmin)
            })
            .catch((error) => console.log(error.response.data.message ? error.response.data.message : error.response.data))
    }, [id])


    return (
        <Container>
            <Row className="justify-content-md-center mt-5">
                <Col md={1}>
                    <Link to="/admin/users" className="btn btn-info my-3">
                        Go Back
                    </Link>
                </Col>
                <Col md={6}>
                    <h1>Edit User</h1>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control name="firstName" required type="text"
                                defaultValue={user.name} />
                        </Form.Group>

                        <Form.Group
                            className="mb-3"
                            controlId="formBasicLastName"
                        >
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                name="lastName"
                                required
                                type='text'
                                defaultValue={user.lastName}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control name="email" required type="email" defaultValue={user.email} />
                        </Form.Group>
                        <Form.Check name='isAdmin' type='checkbox' label='Is Admin' checked={isAdminState} onChange={(e) => setIsAdminState(e.target.checked)} />
                        <Button variant="primary" type="submit">
                            Update
                        </Button>
                        {updateUserResponseState.error}
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default EditUserPageComponent