import EditProductPageComponent from "./components/EditProductPageComponent";
import { useSelector } from "react-redux";
import axios from 'axios'
import { useDispatch } from "react-redux";
import { uploadImagesApiRequest, uploadImagesCloudinaryApiRequest } from "./utils/utils";
import { saveAttributeToDoc } from "../../redux/actions/categoryActions";




const AdminEditProductPage = () => {
  
  const { categories } = useSelector((state) => state.getCategories);
  
  const reduxDispatch = useDispatch();
  
  const fetchProduct = async (productId) => {
      const { data } = await axios.get(`/api/products/get-one/${productId}`);
      console.log(data)
      return data;
  }
  
  const updateProductApiRequest = async (productId, formInputs) => {
      const { data } = await axios.put(`/api/products/admin/${productId}`, { ...formInputs });
      return data;
  }

  const imageDeleteHandler = async (imagePath, productId) => {
      let encoded = encodeURIComponent(imagePath)
      if (process.env.NODE_ENV !== "production") {
      await axios.delete(`/api/products/admin/image/${encoded}/${productId}`);
      } else {
        await axios.delete(`/api/products/admin/image/${encoded}/${productId}?cloudinary=true`);  
      }
  }

  return <EditProductPageComponent categories={categories} fetchProduct={fetchProduct} updateProductApiRequest={updateProductApiRequest} reduxDispatch={reduxDispatch} saveAttributeToCatDoc={saveAttributeToDoc} imageDeleteHandler={imageDeleteHandler} uploadImagesApiRequest={uploadImagesApiRequest} uploadImagesCloudinaryApiRequest={uploadImagesCloudinaryApiRequest}  />;
};

export default AdminEditProductPage;

