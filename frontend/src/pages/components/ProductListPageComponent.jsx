import React, { useEffect, useState } from 'react'
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap'
import SortOptionsComponent from '../../components/SortOptionsComponent'
import PriceFilterComponent from '../../components/filterQueryResultsOptions/PriceFilterComponent'
import RatingFilterComponent from '../../components/filterQueryResultsOptions/RatingFilterComponent'
import CategoryFilterComponent from '../../components/filterQueryResultsOptions/CategoryFilterComponent'
import AttributesFilterComponent from '../../components/filterQueryResultsOptions/AttributesFilterComponent'
import PaginationComponent from '../../components/PaginationComponent'
import ProductForListComponent from '../../components/ProductForListComponent'
import { useLocation, useNavigate, useParams } from "react-router-dom"

const ProductListPageComponent = ({ getProducts, categories }) => {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attrsFilter, setAttrsFilter] = useState([]);//catgeory attributes fromdb and show on the webpage
  const [attrsFromFilter, setAttrsFromFilter] = useState([])//filters for category attributes
  // console.log(attrsFromFilter)
  const [showResetFiltersButton, setShowResetFilterButton] = useState(false);
  const [filters, setFilters] = useState({});//collect filters
  // console.log(filters)
  const [price, setPrice] = useState(500);
  const [ratingFromFilter, setRatingFromFilter] = useState({});
  const [categoriesFromFilter, setCategoriesFromFilter] = useState({});
  const [sortOption, setSortOption] = useState("");
  const [paginationLinksNumber, setPaginationLinksNumber] = useState(null);
  const [pageNum, setPageNum] = useState(null)

  const { categoryName } = useParams() || "";
  const { pageNumParam } = useParams() || 1;
  const { searchQuery } = useParams() || ""

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (categoryName) {
      let categoryAllData = categories.find((item) => item.name === categoryName.replaceAll(",", "/"));
      // console.log(categoryAllData)
      if (categoryAllData) {
        let mainCategory = categoryAllData.name.split("/")[0];
        let index = categories.findIndex((item) => item.name === mainCategory);
        setAttrsFilter(categories[index].attrs)
      }
    } else {
      setAttrsFilter([])
    }
  }, [categoryName, categories])

  useEffect(() => {
    // console.log(Object.entries(categoriesFromFilter))
    if (Object.entries(categoriesFromFilter).length > 0) {
      setAttrsFilter([]);
      var cat = [];
      var count;
      Object.entries(categoriesFromFilter).forEach(([catgeory, checked]) => {
        if (checked) {
          var name = catgeory.split("/")[0];
          cat.push(name);
          count = cat.filter((x) => x === name).length;
          if (count === 1) {
            var index = categories.findIndex((item) => item.name === name);
            setAttrsFilter((attrs) => [...attrs, ...categories[index].attrs])
          }
        }
      })
    }
  }, [categoriesFromFilter, categories])


  useEffect(() => {
    getProducts()
      .then((products) => {
        setProducts(products.products);
        setPaginationLinksNumber(products.paginationLinksNumber);
        setPageNum(products.pageNum)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error);
        setError(true)
      });
    console.log(filters)
  }, [categoryName, pageNumParam, searchQuery, filters, sortOption])

  const handleFilters = () => {
    navigate(location.pathname.replace(/\/[0-9]+$/, ""))
    setShowResetFilterButton(true);
    setFilters({
      price: price,
      rating: ratingFromFilter,
      category: categoriesFromFilter,
      attrs: attrsFromFilter
    })
  }

  const resetFilters = () => {
    setShowResetFilterButton(false);
    setFilters({});
    window.location.href = "/product-list"
  }

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item className="mb-3 mt-3">
              <SortOptionsComponent setSortOption={setSortOption} />
            </ListGroup.Item>
            <ListGroup.Item>
              FILTER: <br />
              <PriceFilterComponent price={price} setPrice={setPrice} />
            </ListGroup.Item>
            <ListGroup.Item>
              <RatingFilterComponent setRatingFromFilter={setRatingFromFilter} />
            </ListGroup.Item>
            {!location.pathname.match(/\/category/) && (
              <ListGroup.Item>
                <CategoryFilterComponent setCategoriesFromFilter={setCategoriesFromFilter} />
              </ListGroup.Item>
            )}
            <ListGroup.Item>
              <AttributesFilterComponent attrsFilter={attrsFilter} setAttrsFromFilter={setAttrsFromFilter} />
            </ListGroup.Item>
            <ListGroup.Item>
              <Button variant="primary" onClick={handleFilters}>Filter</Button>
              {showResetFiltersButton && (
                <Button onClick={resetFilters} variant="danger">Reset filters</Button>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={9}>
          {loading ? (
            <h1>Loading products....</h1>
          ) : error ? (
            <h1>Error while loading products.Try again later</h1>
          ) : (
            products.map((product) => (
              <ProductForListComponent
                key={product._id}
                images={product.images}
                name={product.name}
                description={product.description}
                price={product.price}
                rating={product.rating}
                reviewsNumber={product.reviewsNumber}
                productId={product._id}
              />
            ))
          )}
          {paginationLinksNumber > 1 ? (
            <PaginationComponent categoryName={categoryName} searchQuery={searchQuery} paginationLinksNumber={paginationLinksNumber} pageNum={pageNum} />
          ) : null}
        </Col>
      </Row>
    </Container>
  )
}

export default ProductListPageComponent