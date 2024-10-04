import { Row, Col, Container, Image, ListGroup, Form, Button, Alert } from "react-bootstrap";
import { Rating } from "react-simple-star-rating";
import ImageZoom from "js-image-zoom";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AddedToCartMessageComponent from "../../components/user/AddedToCartMessageComponent";
import MetaComponent from "../../components/MetaComponent";

const ProductDetailsPageComponent = ({ addToCartReduxAction, reduxDispatch, getProductDetails, userInfo, writeReviewApiRequest }) => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [showCartMessage, setShowCartMessage] = useState(false);
    const [product, setProduct] = useState(null);
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewSuccessMessage, setReviewSuccessMessage] = useState(null);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState('');

    const messagesEndRef = useRef(null);

    const addToCartHandler = () => {
        reduxDispatch(addToCartReduxAction(id, quantity));
        setShowCartMessage(true);
    };

    useEffect(() => {
        if (reviewSuccessMessage) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [reviewSuccessMessage]);

    useEffect(() => {
        getProductDetails(id)
            .then((data) => {
                setProduct(data);
                setIsLoading(false);
            })
            .catch((error) => {
                setError(error.response?.data?.message || error.response?.data);
            });
    }, [id, product]);

    useEffect(() => {
        if (product && product.images) {
            const options = {
                scale: 2,
                offset: { vertical: 0, horizontal: 0 },
            };
            product.images.forEach((_, idx) => {
                const imgElement = document.getElementById(`imageId${idx + 1}`);
                if (imgElement) new ImageZoom(imgElement, options);
            });
        }
    }, [product]);

    const sendReviewHandler = (e) => {
        e.preventDefault();

        if (e.currentTarget.checkValidity() === true) {
            const formInputs = {
                comment: comment,
                rating: rating,
            };

            writeReviewApiRequest(product._id, formInputs)
                .then((data) => {
                    if (data === "review created") {
                        const newReview = {
                            user: { name: userInfo.name },
                            rating: formInputs.rating,
                            comment: formInputs.comment,
                            createdAt: new Date().toISOString(),
                        };

                        setProduct((prevProduct) => ({
                            ...prevProduct,
                            reviews: [...prevProduct.reviews, newReview],
                            reviewsNumber: prevProduct.reviewsNumber + 1,
                        }));
                        setReviewSuccessMessage("You successfully reviewed the product.");
                        setComment('');
                        setRating('');
                    }
                })
                .catch((error) => {
                    setReviewSuccessMessage(
                        error.response?.data?.message || error.response?.data || "Failed to submit the review."
                    );
                });
        }
    };

    return (
        <>
            {product && <MetaComponent title={product.name} description={product.description} />}
            <Container>
                <AddedToCartMessageComponent showCartMessage={showCartMessage} setShowCartMessage={setShowCartMessage} />
                <Row className="mt-5">
                    {loading ? (
                        <h2>Loading product details...</h2>
                    ) : error ? (
                        <h2>{error}</h2>
                    ) : (
                        <>
                            <Col style={{ zIndex: 1 }} md={4}>
                                {product.images &&
                                    product.images.map((image, idx) => (
                                        <div key={idx}>
                                            <div id={`imageId${idx + 1}`} key={idx}>
                                                <Image crossOrigin="anonymous" fluid src={image.path ?? null} />
                                            </div>
                                            <br />
                                        </div>
                                    ))}
                            </Col>
                            <Col md={8}>
                                <Row>
                                    <Col md={8}>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item>
                                                <h1>{product.name}</h1>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Rating readonly size={20} initialValue={product.rating} /> ({product.reviewsNumber})
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                Price <span className="fw-bold">$ {product.price}</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item>{product.description}</ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                    <Col md={4}>
                                        <ListGroup>
                                            <ListGroup.Item>Status: {product.count > 0 ? "In stock" : "Out of stock"}</ListGroup.Item>
                                            <ListGroup.Item>
                                                Price: <span className="fw-bold">$ {product.price}</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                Quantity:
                                                <Form.Select
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(e.target.value)}
                                                    size="lg"
                                                    aria-label="Default select example"
                                                >
                                                    {[...Array(product.count).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                <Button onClick={addToCartHandler} variant="danger">
                                                    Add to cart
                                                </Button>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="mt-5">
                                        <h5>REVIEWS</h5>
                                        <ListGroup variant="flush">
                                            {product.reviews &&
                                                product.reviews.map((review, index) => (
                                                    <ListGroup.Item key={index}>
                                                        {review.user.name} <br />
                                                        <Rating readonly size={20} initialValue={review.rating} />
                                                        <br />
                                                        {review.createdAt.substring(0, 10)} <br />
                                                        {review.comment}
                                                    </ListGroup.Item>
                                                ))}
                                            <div ref={messagesEndRef} />
                                        </ListGroup>
                                    </Col>
                                </Row>
                                <hr />
                                {!userInfo.name && <Alert variant="danger">Login first to write a review</Alert>}

                                <Form onSubmit={sendReviewHandler}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Write a review</Form.Label>
                                        <Form.Control
                                            name="comment"
                                            required
                                            as="textarea"
                                            disabled={!userInfo.name}
                                            rows={3}
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Select
                                        name="rating"
                                        required
                                        disabled={!userInfo.name}
                                        value={rating}
                                        onChange={(e) => setRating(e.target.value)}
                                        aria-label="Default select example"
                                    >
                                        <option value="">Your rating</option>
                                        <option value="5">5 (Very good)</option>
                                        <option value="4">4 (Good)</option>
                                        <option value="3">3 (Average)</option>
                                        <option value="2">2 (Bad)</option>
                                        <option value="1">1 (Awful)</option>
                                    </Form.Select>
                                    <Button type="submit" disabled={!userInfo.name} className="mb-3 mt-3" variant="primary">
                                        Submit
                                    </Button>
                                    {reviewSuccessMessage && <Alert variant="success">{reviewSuccessMessage}</Alert>}
                                </Form>
                            </Col>
                        </>
                    )}
                </Row>
            </Container>
        </>
    );
};

export default ProductDetailsPageComponent;
