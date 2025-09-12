import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../api";
import { Edit2, Save, X, CheckCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import ProfilePic from "../components/ProfilePic";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      dob: user?.dob ? user.dob.split("T")[0] : "",
      password: "",
      about: user?.about || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().min(2, "Too short").required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      dob: Yup.date().required("Required"),
      password: Yup.string().min(6, "At least 6 characters"),
      about: Yup.string().min(10, "At least 10 characters").required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!editMode) return;
        await API.put("/profile/update", values, {
          headers: { Authorization: `Bearer ${token}` },
        });

        dispatch(
          loginUser({
            email: values.email,
            password: values.password || undefined,
          })
        );

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2500);

        setEditMode(false);
      } catch (error) {
        console.error(error);
        alert("❌ Error updating profile");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;

        formik.setValues({
          name: data.name || "",
          email: data.email || "",
          dob: data.dob ? data.dob.split("T")[0] : "",
          password: "",
          about: data.about || "",
        });
      } catch (error) {
        console.error(error);
        alert("❌ Error fetching profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const renderInput = (id, type, placeholder, label) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[id]}
        readOnly={!editMode && id !== "password"}
        className={`w-full border px-3 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
          !editMode && id !== "password"
            ? "bg-gray-100 cursor-not-allowed"
            : "bg-white"
        }`}
      />
      {formik.touched[id] && formik.errors[id] && (
        <p className="text-red-500 text-xs mt-1">{formik.errors[id]}</p>
      )}
    </div>
  );

  if (loading) return <p className="text-center mt-6">Loading profile...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 bg-gradient-to-br mt-40 mb-40 from-white to-blue-50 rounded-3xl shadow-xl relative"
    >
      {/* Floating success animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="absolute top-4 right-4 flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-full shadow-lg"
          >
            <CheckCircle size={18} /> Saved!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Actions */}
      <div className="absolute top-4 right-4">
        {!editMode ? (
          <button
            type="button"
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90 transition"
          >
            <Edit2 size={18} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="submit"
              form="profileForm"
              disabled={formik.isSubmitting}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
            >
              <Save size={18} />{" "}
              {formik.isSubmitting ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-500 transition"
            >
              <X size={18} /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* Profile Header Section */}
      <div className="flex items-start gap-6 mb-8">
        <ProfilePic
          src={user?.profileImage}
          name={formik.values.name}
          size="xl"
          className="shadow-lg border-4 border-white rounded-2xl w-40 h-40 object-cover"
          square // ✅ square style
        />
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {formik.values.name}
          </h2>
          <p className="text-gray-500 text-lg">{formik.values.email}</p>
          <p className="mt-2 text-sm text-gray-600 italic">
            {formik.values.dob ? `Born on ${formik.values.dob}` : ""}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <form id="profileForm" onSubmit={formik.handleSubmit} className="space-y-4">
        {renderInput("name", "text", "John Doe", "Full Name")}
        {renderInput("email", "email", "john@example.com", "Email")}
        {renderInput("dob", "date", "", "Date of Birth")}
        {editMode && renderInput("password", "password", "******", "New Password")}

        {/* About */}
        <div>
          <label
            htmlFor="about"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            About
          </label>
          {!editMode ? (
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 p-3 rounded-xl text-gray-700 shadow-inner"
            >
              {formik.values.about || "No bio yet..."}
            </motion.div>
          ) : (
            <textarea
              id="about"
              name="about"
              placeholder="Write something about yourself..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.about}
              className="w-full border px-3 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
              rows="3"
            />
          )}
          {formik.touched.about && formik.errors.about && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.about}</p>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default Profile;
