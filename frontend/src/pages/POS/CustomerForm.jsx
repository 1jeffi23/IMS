import { useState } from "react";
import { useCreateCustomerMutation } from "../../services/customerApi";

const CustomerForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const customer = await createCustomer(formData).unwrap();

      console.log("Customer created:", customer);

      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
      });

      onSuccess?.(customer);
    } catch (error) {
      console.error("Create customer error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Customer Name */}
      <div>
        <label className="block mb-1">
          Customer Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter customer name"
          required
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block mb-1">
          Phone
        </label>

        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block mb-1">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block mb-1">
          Address
        </label>

        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter address"
          rows={3}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 rounded-md"
        >
          {isLoading ? "Saving..." : "Add Customer"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border"
          >
            Cancel
          </button>
        )}
      </div>

    </form>
  );
};

export default CustomerForm;