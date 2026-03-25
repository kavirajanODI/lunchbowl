import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import { FiEdit } from "react-icons/fi";

const ProductTable = ({ products = [], setIsCheck, onEdit }) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return imagePath.startsWith("http")
      ? imagePath
      : `https://api.lunchbowl.co.in/${imagePath}`;
  };

  console.log("====================================");
  console.log("ProductTable products:", products);
  // Correct way to log first product's image (for debugging)
  if (products.length > 0) {
    console.log("First product image path:", products[0].image);
  }
  console.log("====================================");

  return (
    <TableBody>
      {products.map((product) => (
        <TableRow key={product._id}>
          <TableCell className="px-4 py-3">
            <div className="flex items-center">
              {product.image && (
                <div className="hidden sm:block mr-3">
                  <img
                    crossorigin="anonymous"
                    priority
                    className="w-10 h-10 rounded-full object-cover"
                    src={getImageUrl(product.image)}
                    alt={product.primaryDishTitle}
                  />
                </div>
              )}
              <div>
                <h2 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {product?.primaryDishTitle || "Untitled"}
                </h2>
                {product.subDishTitle && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {product.subDishTitle}
                  </p>
                )}
              </div>
            </div>
          </TableCell>

          <TableCell className="px-4 py-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {product?.cuisine || "Not specified"}
            </span>
          </TableCell>

          <TableCell className="px-4 py-3 text-center">
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full 
              ${
                product?.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {product?.status === "active" ? "Active" : "Inactive"}
            </span>
          </TableCell>

          <TableCell className="px-4 py-3 text-right">
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => onEdit(product)}
                className="text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400"
                aria-label="Edit"
              >
                <FiEdit className="w-5 h-5" />
              </button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default ProductTable;