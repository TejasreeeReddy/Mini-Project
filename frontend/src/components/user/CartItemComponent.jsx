import { Row, Col, Image, ListGroup, Form, Button } from "react-bootstrap";
import RemoveFromCartComponent from "../RemoveFromCartComponent";

const CartItemComponent = ({ item, removeFromCartHandler = false, orderCreated = false, changeCout = false }) => {
    return (
        <>
            <ListGroup.Item>
                <Row>
                    <Col md={2}>
                        <Image crossOrigin="anonymous" src={item.image.path || item.image} alt="image" fluid />
                    </Col>
                    <Col md={2}>
                        {item.name}
                    </Col>
                    <Col md={2}>
                        <b>${item.price}</b>
                    </Col>
                    <Col md={3}>
                        <Form.Select
                            value={item.quantity}
                            onChange={changeCout ? (e) => changeCout(item.productId, e.target.value) : undefined}
                            disabled={orderCreated || !changeCout} // Disable if order is created or changeCout is false
                        >
                            {[...Array(item.count).keys()].map(x => (
                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={3}>
                        <RemoveFromCartComponent 
                            orderCreated={orderCreated}
                            productId={item.productId}
                            quantity={item.quantity}
                            price={item.price}
                            removeFromCartHandler={removeFromCartHandler ? removeFromCartHandler : undefined} 
                        />
                    </Col>
                </Row>
            </ListGroup.Item>
            <br />
        </>
    );
};

export default CartItemComponent;
