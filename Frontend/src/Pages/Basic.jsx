import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../api";
import { useNavigate } from "react-router-dom";
// Regex for names (letters, spaces, hyphens, apostrophes)
const nameRegex = /^[A-Za-z\s'-]+$/;
// Regex for hobbies (letters, commas, spaces)
const hobbiesRegex = /^[A-Za-z\s,]+$/;

const Form = () => {
  const navigate = useNavigate();
  

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      gender: "",
      address: "",
      startDate: "",
      hobbies: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must not exceed 50 characters")
        .matches(
          nameRegex,
          "First name can only contain letters, spaces, hyphens, and apostrophes"
        )
        .test(
          "first-letter-capital",
          "First letter must be capitalized",
          (value) => value && value[0] === value[0].toUpperCase()
        )
        .required("First name is required"),
      lastName: Yup.string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must not exceed 50 characters")
        .matches(
          nameRegex,
          "Last name can only contain letters, spaces, hyphens, and apostrophes"
        )
        .test(
          "first-letter-capital",
          "First letter must be capitalized",
          (value) => value && value[0] === value[0].toUpperCase()
        )
        .required("Last name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      age: Yup.number()
        .required("Age is required")
        .min(1, "Age must be at least 1")
        .max(120, "Age seems invalid"),
      gender: Yup.string()
        .oneOf(["male", "female", "other"], "Select a valid gender")
        .required("Gender is required"),
      address: Yup.string()
        .min(10, "Address is too short")
        .max(200, "Address is too long")
        .required("Address is required"),
      startDate: Yup.date()
        .max(new Date(), "Start date cannot be in the future")
        .required("Start date is required"),
      hobbies: Yup.string()
        .matches(hobbiesRegex, "Hobbies can only contain letters and commas")
        .min(3, "Hobbies must be at least 3 characters")
        .max(100, "Hobbies too long")
        .required("Hobbies are required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const { data } = await API.post("/forms", values);
        alert(data.message);
        console.log(data);
        resetForm();
        navigate("/dashboard");
      } catch (error) {
        alert(error.response?.data?.message || "Error submitting form");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-3xl mx-auto  p-6 m-10 bg-gray-300 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6 text-cente ">
        Registration Form
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block mb-1 font-medium ">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="John"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2  ${
              formik.touched.firstName && formik.errors.firstName
                ? "border-red-500 focus:ring-red-300"
                : "border-black-300 focus:ring-purple-400"
            }`}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.firstName}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block mb-1 font-medium">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Doe"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formik.touched.lastName && formik.errors.lastName
                ? "border-red-500 focus:ring-red-300"
                : "border-black-300 focus:ring-purple-400"
            }`}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.lastName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="john@example.com"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formik.touched.email && formik.errors.email
                ? "border-red-500 focus:ring-red-300"
                : "border-black-300 focus:ring-purple-400"
            }`}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className="block mb-1 font-medium">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.age}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formik.touched.age && formik.errors.age
                ? "border-red-500 focus:ring-red-300"
                : "border-black-300 focus:ring-purple-400"
            }`}
          />
          {formik.touched.age && formik.errors.age && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.age}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block mb-1 font-medium">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.gender}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2className="bg-black ${
              formik.touched.gender && formik.errors.gender
                ? "border-red-500 focus:ring-red-300"
                : "border-black-300 focus:ring-purple-400 "
            }`}
          >
            <option value="" className="k">
              Select gender
            </option>
            <option value="male" className="">
              Male
            </option>
            <option value="female" className="">
              Female
            </option>
            <option value="other" className="">
              Other
            </option>
          </select>
          {formik.touched.gender && formik.errors.gender && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block mb-1 font-medium">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            placeholder="123 Main Street, City"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formik.touched.address && formik.errors.address
                ? "border-red-500 focus:ring-red-300"
                : "border-black-300 focus:ring-purple-400"
            }`}
          />
          {formik.touched.address && formik.errors.address && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.address}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block mb-1 font-medium">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.startDate}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formik.touched.startDate && formik.errors.startDate
                ? "border-red-500 focus:ring-red-300"
                : "border-black-300 focus:ring-purple-400"
            }`}
          />
          {formik.touched.startDate && formik.errors.startDate && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.startDate}
            </p>
          )}
        </div>

        {/* Hobbies */}
        <div>
          <label htmlFor="hobbies" className="block mb-1 font-medium">
            Hobbies
          </label>
          <input
            type="text"
            id="hobbies"
            name="hobbies"
            placeholder="Reading, Coding, Music"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.hobbies}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              formik.touched.hobbies && formik.errors.hobbies
                ? "border-red-500 focus:ring-red-300"
                : "border-black-300 focus:ring-purple-400"
            }`}
          />
          {formik.touched.hobbies && formik.errors.hobbies && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.hobbies}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-blue-400 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          {formik.isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Form;
