import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FormPage() {
  const [formData, setFormData] = useState({
    amt: "",
    city_pop: "",
    hour: "",
    distance_km: "",
    category: "",
    gender: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      // Create a new categories object where the selected category is 1, and others are 0
      const updatedCategoryData = {
        category_entertainment: 0,
        category_food_dining: 0,
        category_gas_transport: 0,
        category_grocery_net: 0,
        category_grocery_pos: 0,
        category_health_fitness: 0,
        category_home: 0,
        category_kids_pets: 0,
        category_misc_net: 0,
        category_misc_pos: 0,
        category_personal_care: 0,
        category_shopping_net: 0,
        category_shopping_pos: 0,
        category_travel: 0,
      };

      // Set the selected category to 1
      updatedCategoryData[value] = 1;

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        ...updatedCategoryData,
      }));
    } else if (name === "gender") {
      // Create a new gender object where the selected gender is 1, and the other is 0
      const updatedGenderData = {
        gender_F: 0,
        gender_M: 0,
      };

      // Set the selected gender to 1
      updatedGenderData[value] = 1;

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        ...updatedGenderData,
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Log the form data to ensure it's correct
    console.log("Form Data:", formData);

    // Navigate to the result page with the form data
    navigate("/result", { state: formData });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
        <h1 className="text-2xl font-bold text-center mb-4">Risk Prediction Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["amt", "city_pop", "hour", "distance_km"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.replace("_", " ").toUpperCase()}
              className="w-full p-2 border rounded"
              value={formData[field]}
              onChange={handleChange}
              required
            />
          ))}

          <select name="category" className="w-full p-2 border rounded" onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="category_entertainment">Category Entertainment</option>
            <option value="category_food_dining">Category Food Dining</option>
            <option value="category_gas_transport">Gas Transport</option>
            <option value="category_grocery_net">Grocery Net</option>
            <option value="category_grocery_pos">Grocery Pos</option>
            <option value="category_health_fitness">Health Fitness</option>
            <option value="category_home">Home</option>
            <option value="category_kids_pets">Kids Pets</option>
            <option value="category_misc_net">Misc Net</option>
            <option value="category_misc_pos">Misc Pos</option>
            <option value="category_personal_care">Personal Care</option>
            <option value="category_shopping_net">Shopping Net</option>
            <option value="category_shopping_pos">Shopping Pos</option>
            <option value="category_travel">Travel</option>
          </select>

          <select name="gender" className="w-full p-2 border rounded" onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="gender_F">Female</option>
            <option value="gender_M">Male</option>
          </select>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-800">
            Predict Risk Probability
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormPage;