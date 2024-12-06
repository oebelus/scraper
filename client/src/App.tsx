import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./index.css";
import Category from "./pages/Category";
import ProductPage from "./pages/ProductPage";
import CustomCategory from "./pages/CustomCategory";

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-900 text-white">
          <Routes>
            <Route path="/coffee-grinder" element={<Category title="Coffee Grinder" />} />
            <Route path="/laptops" element={<Category title="Laptops" />} />
            <Route path="/building-blocks" element={<Category title="Building Blocks" />} />
            <Route path="/custom-category" element={<CustomCategory />} />
            <Route path="/product/:id" element={<ProductPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
