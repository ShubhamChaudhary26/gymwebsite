// components/ProductForm.jsx
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ProductForm = ({
  onSubmit,
  onCancel,
  loading,
  isEdit = false,
  initialData = {},
}) => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    photo: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isEdit && initialData) {
      setValues({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        photo: null,
      });
      setPreview(initialData.photo || null);
    }
  }, [isEdit, initialData]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setValues({ ...values, photo: file });
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    if (values.photo) formData.append("photo", values.photo);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-0.5">Name *</label>
        <Input
          name="name"
          value={values.name}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-0.5">
          Description *
        </label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          rows={3}
          disabled={loading}
          className="w-full rounded border border-input px-3 py-1 text-sm"
          placeholder="Product details"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-0.5">Price *</label>
        <Input
          name="price"
          type="number"
          value={values.price}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-0.5">
          Photo {isEdit && "(leave blank to keep current)"}
        </label>
        <Input
          name="photo"
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={loading}
        />
        {preview && (
          <img
            src={preview}
            className="mt-2 h-20 object-cover rounded border"
          />
        )}
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update" : "Add Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
