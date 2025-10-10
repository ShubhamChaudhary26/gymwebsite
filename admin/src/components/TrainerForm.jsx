// components/TrainerForm.jsx
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialFormState = {
  name: "",
  post: "",
  instagramId: "",
  image: null,
};

const validate = (values, isEdit) => {
  const errors = {};
  if (!String(values.name).trim()) errors.name = "Name is required";
  if (!String(values.post).trim()) errors.post = "Post is required";
  if (!isEdit && !values.image) errors.image = "Image is required";
  return errors;
};

const TrainerForm = ({
  initialData = {}, // ✅ Prop ka naam initialData rakhte hai for consistency
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
}) => {
  // ✅ Initial state ko simple rakho
  const [values, setValues] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ ProductForm jaisa useEffect
  useEffect(() => {
    if (isEdit && initialData?._id) {
      setValues({
        name: initialData.name || "",
        post: initialData.post || "",
        instagramId: initialData.instagramId || "",
        image: null, // Image file reset kar dete hai
      });
      setImagePreview(initialData.image || null);
      setErrors({});
      setTouched({});
    } else {
      // Reset for create form
      setValues(initialFormState);
      setImagePreview(null);
    }
  }, [isEdit, initialData]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setValues((prev) => ({ ...prev, image: file }));
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(values, isEdit);
    setErrors(validationErrors);
    setTouched(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("post", values.post);
      formData.append("instagramId", values.instagramId);
      if (values.image) formData.append("image", values.image);
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block font-medium mb-0.5">Name *</label>
        <Input
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          placeholder="Trainer name"
        />
        {touched.name && errors.name && (
          <p className="text-red-600 text-xs mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <label className="block font-medium mb-0.5">Post *</label>
        <Input
          name="post"
          value={values.post}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          placeholder="Fitness Coach / Yoga Trainer"
        />
        {touched.post && errors.post && (
          <p className="text-red-600 text-xs mt-1">{errors.post}</p>
        )}
      </div>
      <div>
        <label className="block font-medium mb-0.5">Instagram</label>
        <Input
          name="instagramId"
          value={values.instagramId}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
          placeholder="trainer_instagram"
        />
      </div>
      <div>
        <label className="block font-medium mb-0.5">
          Image {isEdit ? "(leave blank to keep current)" : "*"}
        </label>
        <Input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={loading}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 h-24 w-24 rounded border object-cover"
          />
        )}
        {touched.image && errors.image && (
          <p className="text-red-600 text-xs mt-1">{errors.image}</p>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? isEdit
              ? "Updating..."
              : "Adding..."
            : isEdit
            ? "Update Trainer"
            : "Add Trainer"}
        </Button>
      </div>
    </form>
  );
};

export default TrainerForm;
