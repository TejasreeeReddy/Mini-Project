import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/actions/cartActions";
import ProductDetailsPageComponent from "./components/ProductDetailsPageComponent";
import axios from "axios";

const ProductDetailsPage = () => {
  const userInfo = useSelector((state) => state.userRegisterLogin.userInfo.userInfo)
  const dispatch = useDispatch()
  const getProductDetails = async (id) => {
    const { data } = await axios.get(`/api/products/get-one/${id}`);
    return data
  }

  const writeReviewApiRequest = async (productId, formInputs) => {
    const { data } = axios.post(`/api/users/review/${productId}`, { ...formInputs });
    return data
  }


  return <ProductDetailsPageComponent addToCartReduxAction={addToCart} reduxDispatch={dispatch} getProductDetails={getProductDetails} userInfo={userInfo} writeReviewApiRequest={writeReviewApiRequest} />;
};

export default ProductDetailsPage;

