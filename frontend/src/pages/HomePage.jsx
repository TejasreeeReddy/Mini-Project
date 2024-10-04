import { useSelector } from "react-redux";
import HomePageComponent from "./components/HomePageComponent";
import axios from "axios";

const HomePage = () => {
  const { categories } = useSelector((state) => state.getCategories)

  const getBestsellers = async () => {
    const { data } = await axios.get("/api/products/bestsellers");
    return data;
    
  }
  return (
    <HomePageComponent categories={categories} getBestsellers={getBestsellers} />
  );
};

export default HomePage;

