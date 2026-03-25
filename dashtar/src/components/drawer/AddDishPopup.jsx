import React, { useState, useEffect } from "react";
import Popup from "./Popup";
import ProductServices from "@/services/ProductServices";
import { FiPlus, FiX } from "react-icons/fi";
import config from "@/config";

const initialState = {
  primaryDishTitle: "",
  // subDishTitle removed
  shortDescription: "",
  description: "",
   Idescription: "",
  cuisine: "",
  image: null,
  dishImage2: null,
  status: "active",
  // ingredients removed
  nutritionValues: [""], // Array of strings instead of JSON (kept same as before)
};

const AddDishPopup = ({
  isOpen,
  onClose,
  onSuccess,
  productData,
  isEditing,
}) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [dishImage2Preview, setDishImage2Preview] = useState("");

  const inputClasses =
    "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white";
  const textareaClasses = `${inputClasses} min-h-[100px]`;
  const buttonClasses =
    "px-4 py-2 rounded-md font-medium transition-colors duration-200";
  const labelClasses =
    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const imagePreviewClasses =
    "mt-2 w-full h-48 object-cover rounded-md border border-gray-300 dark:border-gray-600";

  useEffect(() => {
    if (productData) {
      setForm({
        primaryDishTitle: productData.primaryDishTitle || "",
        // subDishTitle removed
        shortDescription: productData.shortDescription || "",
        description: productData.description || "",
        cuisine: productData.cuisine || "",
        image: productData.image || null,
        dishImage2: productData.dishImage2 || null,
        status: productData.status || "active",
         Idescription: productData.Idescription || "", 
        nutritionValues:
          productData.nutritionValues?.length > 0
            ? productData.nutritionValues
            : [""],
      });

      if (productData.image) {
        const imageUrl = productData.image.startsWith("http")
          ? productData.image
          : productData.image.startsWith("/")
            ? `https://api.lunchbowl.co.in/${productData.image}`
          : productData.image;
        setImagePreview(imageUrl);
      }

      if (productData.dishImage2) {
        const imageUrl2 = productData.dishImage2.startsWith("http")
          ? productData.dishImage2
          : productData.dishImage2.startsWith("/")
            ? `https://api.lunchbowl.co.in/${productData.dishImage2}`
          : productData.dishImage2;
        setDishImage2Preview(imageUrl2);
      }
    } else {
      setForm(initialState);
      setImagePreview("");
      setDishImage2Preview("");
    }
  }, [productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayFieldChange = (field, index, value) => {
    setForm((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayField = (field) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayField = (field, index) => {
    if (index === 0) return;

    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e, field, previewSetter) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      previewSetter(previewUrl);
      setForm((prev) => ({ ...prev, [field]: file }));
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mandatory fields
    // Ingredients removed from validation
    if (!form.nutritionValues[0]) {
      setError("Please fill in all mandatory fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("primaryDishTitle", form.primaryDishTitle);
      // subDishTitle removed
      formData.append("shortDescription", form.shortDescription);
      formData.append("description", form.description);
      formData.append("cuisine", form.cuisine);
      formData.append("status", form.status);
      formData.append("Idescription", form.Idescription); 
      // Ingredients removed from append
      // Append nutritionValues as array fields
      form.nutritionValues.forEach((nut, i) =>
        formData.append(`nutritionValues[${i}]`, nut)
      );

      if (form.image instanceof File) {
        formData.append("image", form.image);
      } else if (isEditing && form.image) {
        formData.append("existingImage", form.image);
      }

      if (form.dishImage2 instanceof File) {
        formData.append("dishImage2", form.dishImage2);
      } else if (isEditing && form.dishImage2) {
        formData.append("existingDishImage2", form.dishImage2);
      }

      let response;
      if (isEditing) {
        response = await ProductServices.updateDish(productData._id, formData);
      } else {
        response = await ProductServices.addDish(formData);
      }

      onSuccess?.(response.data, true);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Error processing dish");
      onSuccess?.(null, false);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderArrayField = (field, label, placeholder) => {
    return (
      <div className="mb-4">
        <label className={labelClasses}>{label}</label>
        {form[field].map((value, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={value}
              onChange={(e) =>
                handleArrayFieldChange(field, index, e.target.value)
              }
              placeholder={placeholder}
              className={`${inputClasses} flex-grow`}
              required={index === 0}
            />
            {index === 0 ? (
              <span className="ml-2 text-red-500">*</span>
            ) : (
              <button
                type="button"
                onClick={() => removeArrayField(field, index)}
                className="ml-2 p-2 text-red-500 hover:text-red-700"
                aria-label={`Remove ${label}`}
              >
                <FiX />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayField(field)}
          className="flex items-center text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          <FiPlus className="mr-1" />
          Add {label}
        </button>
      </div>
    );
  };

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Dish" : "Add New Dish"}
      width="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="primaryDishTitle" className={labelClasses}>
            Primary Dish Title *
          </label>
          <input
            id="primaryDishTitle"
            name="primaryDishTitle"
            value={form.primaryDishTitle}
            onChange={handleChange}
            placeholder="e.g., Spaghetti Carbonara"
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label htmlFor="shortDescription" className={labelClasses}>
            Short Description *
          </label>
          <input
            id="shortDescription"
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            placeholder="Brief description (max 50 characters)"
            className={inputClasses}
            maxLength={50}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className={labelClasses}>
            Full Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Detailed description of the dish..."
            className={textareaClasses}
            required
          />
        </div>

        <div>
        <label htmlFor="Idescription" className={labelClasses}>
          Idescription *
        </label>
        <input
          id="Idescription"
          name="Idescription"
          value={form.Idescription}
          onChange={handleChange}
          placeholder="Enter Idescription"
          className={inputClasses}
          required
        />
      </div>

        {/* Removed Ingredients field */}
        {/* Nutrition Values Field */}
        {renderArrayField(
          "nutritionValues",
          "Nutrition Values",
          "Enter nutrition info (e.g., Calories: 250)"
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cuisine" className={labelClasses}>
              Cuisine Type *
            </label>
            <input
              id="cuisine"
              name="cuisine"
              value={form.cuisine}
              onChange={handleChange}
              placeholder="e.g., Italian, Mexican, etc."
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label htmlFor="status" className={labelClasses}>
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClasses}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* First Image */}
        <div>
          <label htmlFor="image" className={labelClasses}>
            Dish Image {!isEditing && "*"}
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-4 ${
              !imagePreview
                ? "border-gray-300 dark:border-gray-600"
                : "border-emerald-500"
            }`}
          >
            <div className="flex flex-col items-center justify-center">
              {imagePreview ? (
                <>
                  <img
                    crossorigin="anonymous"
                    priority
                    src={imagePreview}
                    alt="Preview"
                    className={`${imagePreviewClasses} mb-3`}
                  />
                  <label
                    htmlFor="image"
                    className="cursor-pointer text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
                  >
                    Change Image
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(e, "image", setImagePreview)
                    }
                    className="hidden"
                  />
                </>
              ) : (
                <>
                  <svg
                    className="w-12 h-12 text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <label
                    htmlFor="image"
                    className="cursor-pointer bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-800 px-4 py-2 rounded-md font-medium"
                  >
                    Select Image
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(e, "image", setImagePreview)
                    }
                    className="hidden"
                    required={!isEditing}
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    JPG, PNG, or GIF (Max 5MB)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Second Image */}
        <div>
          <label htmlFor="dishImage2" className={labelClasses}>
            Second Dish Image
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-4 ${
              !dishImage2Preview
                ? "border-gray-300 dark:border-gray-600"
                : "border-emerald-500"
            }`}
          >
            <div className="flex flex-col items-center justify-center">
              {dishImage2Preview ? (
                <>
                  <img
                    crossorigin="anonymous"
                    priority
                    src={dishImage2Preview}
                    alt="Preview"
                    className={`${imagePreviewClasses} mb-3`}
                  />
                  <label
                    htmlFor="dishImage2"
                    className="cursor-pointer text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
                  >
                    Change Image
                  </label>
                  <input
                    id="dishImage2"
                    name="dishImage2"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(e, "dishImage2", setDishImage2Preview)
                    }
                    className="hidden"
                  />
                </>
              ) : (
                <>
                  <svg
                    className="w-12 h-12 text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <label
                    htmlFor="dishImage2"
                    className="cursor-pointer bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-800 px-4 py-2 rounded-md font-medium"
                  >
                    Select Image
                  </label>
                  <input
                    id="dishImage2"
                    name="dishImage2"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(e, "dishImage2", setDishImage2Preview)
                    }
                    className="hidden"
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    JPG, PNG, or GIF (Max 5MB)
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            className={`${buttonClasses} bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700`}
            onClick={() => {
              onClose();
              setForm(initialState);
              setImagePreview("");
              setDishImage2Preview("");
            }}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${buttonClasses} bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center min-w-[120px]`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : isEditing ? (
              "Update Dish"
            ) : (
              "Add Dish"
            )}
          </button>
        </div>
      </form>
    </Popup>
  );
};

export default AddDishPopup;
