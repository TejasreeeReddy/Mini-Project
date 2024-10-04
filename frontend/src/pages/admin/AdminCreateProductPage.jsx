import CreateProductPageComponent from "./components/CreateProductPageComponent";
import axios from "axios";
import { uploadImagesApiRequest, uploadImagesCloudinaryApiRequest } from "./utils/utils";
import { useDispatch, useSelector } from "react-redux"
import { newCategory, deleteCategory, saveAttributeToDoc } from "../../redux/actions/categoryActions";


const AdminCreateProductPage = () => {
  const reduxDispatch = useDispatch();
  const { categories } = useSelector((state) => state.getCategories);


  const createProductApiRequest = async (formInputs) => {
    const { data } = await axios.post(`/api/products/admin`, { ...formInputs });
    return data;
  }

  saveAttributeToDoc
  return <CreateProductPageComponent createProductApiRequest={createProductApiRequest} uploadImagesApiRequest={uploadImagesApiRequest} uploadImagesCloudinaryApiRequest={uploadImagesCloudinaryApiRequest} categories={categories} reduxDispatch={reduxDispatch} newCategory={newCategory} deleteCategory={deleteCategory} saveAttributeToDoc={saveAttributeToDoc} />;
};

export default AdminCreateProductPage;

