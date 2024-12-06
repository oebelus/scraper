import { Link } from "react-router-dom";

const Sidebar = () => {
  const categories = ["coffee grinder", "laptops", "building blocks", "custom category"];
  
  return (
    <div className="w-64 bg-gray-800 text-white p-6">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      <ul className="space-y-4">
        {categories.map((category) => (
          <li key={category}>
            <Link
              to={`/${category.split(" ").join("-").toLowerCase()}`}
              className="hover:text-gray-400 transition-colors"
            >
              {category.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1) + " ")}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
