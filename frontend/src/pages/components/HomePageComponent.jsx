import React, { useEffect, useState } from 'react'
import { Row, Container } from "react-bootstrap";
import ProductCarouselComponent from '../../components/ProductCarouselComponent';
import CategoryCardComponent from '../../components/CategoryCardComponent';
import MetaComponent from '../../components/MetaComponent';

const HomePageComponent = ({ categories, getBestsellers }) => {
    const [mainCategories, setMainCategories] = useState([]);
    const [bestsellers, setBestsellers] = useState([]);

    useEffect(() => {
        getBestsellers()
            .then((data) => {
                setBestsellers(data);
            })
            .catch((error) => console.log(error.response.data.message ? error.response.data.message : error.response.data))
        setMainCategories((cat) => categories.filter((item) => !item.name.includes("/")))
    }, [categories])
    return (
        <>
            <MetaComponent />
            <ProductCarouselComponent bestsellers={bestsellers} />
            <Container>
                <Row xs={1} md={2} className="g-4 mt-5">
                    {mainCategories.map((category, idx) => (
                        <CategoryCardComponent key={idx} category={category} idx={idx} />
                    ))}
                </Row>
            </Container>
        </>
    )
}

export default HomePageComponent