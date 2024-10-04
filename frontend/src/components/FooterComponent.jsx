import { Container, Row, Col } from "react-bootstrap";

const FooterComponent = () => {
  return (
    <footer>
      <Container fluid>
        <Row className="mt-3">
          <Col className="bg-dark text-white text-center py-3">
            Copyright &copy; Vanams Online Store
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterComponent;

