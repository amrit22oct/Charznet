import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import API from "../api";
import { Edit2, Save, X, CheckCircle, Key } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import ProfilePic from "../components/ProfilePic";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch profile data
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

  // Edit Profile Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      dob: "",
      about: "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().min(2, "Too short").required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      dob: Yup.date().required("Required"),
      about: Yup.string()
        .min(10, "At least 10 characters")
        .required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await API.put("/profile/update", values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(loginUser({ email: values.email }));
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

  // Password Form Formik
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Required"),
      newPassword: Yup.string()
        .min(6, "At least 6 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await API.put(
          "/profile/password",
          {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("✅ Password updated successfully!");
        resetForm();
        setShowPasswordForm(false);
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "❌ Password update failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

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
        className="w-full border px-3 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
      />
      {formik.touched[id] && formik.errors[id] && (
        <p className="text-red-500 text-xs mt-1">{formik.errors[id]}</p>
      )}
    </div>
  );

  const renderPasswordInput = (id, type, placeholder, label) => (
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
        onChange={passwordFormik.handleChange}
        onBlur={passwordFormik.handleBlur}
        value={passwordFormik.values[id]}
        className="w-full border px-3 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
      />
      {passwordFormik.touched[id] && passwordFormik.errors[id] && (
        <p className="text-red-500 text-xs mt-1">{passwordFormik.errors[id]}</p>
      )}
    </div>
  );

  if (loading) return <p className="text-center mt-6">Loading profile...</p>;

  return (
    <div className="relative max-w-4xl mx-auto p-6 bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl mt-20 mb-20">
      {/* Success Toast */}
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

      {/* Top Right Buttons */}
      <div className="absolute top-4 right-4 flex flex-col md:flex-row gap-2">
        <button
          onClick={() => {
            setEditMode(true);
            setShowPasswordForm(false);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md cursor-pointer hover:opacity-90 transition"
        >
          <Edit2 size={18} /> Edit Profile
        </button>

        <button
          onClick={() => {
            setShowPasswordForm(true);
            setEditMode(false);
          }}
          className="flex items-center gap-2 bg-yellow-500 cursor-pointer text-white px-4 py-2 rounded-lg shadow-md hover:opacity-90 transition"
        >
          <Key size={18} /> Change Password
        </button>
      </div>

      {/* Profile Info */}
      <div className="flex items-start mt-6 gap-6 mb-6">
        <ProfilePic
          src={user?.profileImage}
          name={formik.values.name}
          size="xl"
          className="shadow-lg border-4 border-white rounded-2xl w-40 h-40 object-cover"
          square
        />
        <div>
          <h2 className="text-3xl font-bold mt-4 text-gray-800">
            {formik.values.name}
          </h2>
          <p className="text-gray-500 text-lg">{formik.values.email}</p>
          <p className="mt-2 text-sm text-gray-600 italic">
            {formik.values.dob ? `Born on ${formik.values.dob}` : ""}
          </p>
          <p className="mt-2 text-gray-700">
            {formik.values.about || "No bio yet..."}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {/* Edit Profile Form */}
        {editMode && (
          <motion.form
            key="editProfile"
            onSubmit={formik.handleSubmit}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="bg-white p-6 rounded-2xl shadow-xl mb-6 space-y-4"
          >
            {renderInput("name", "text", "Full Name", "Full Name")}
            {renderInput("email", "email", "Email", "Email")}
            {renderInput("dob", "date", "", "Date of Birth")}
            <div>
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                About
              </label>
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
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="bg-green-600 text-white  cursor-pointer px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-400 text-white px-4 cursor-pointer py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}

        {/* Change Password Form */}
        {showPasswordForm && (
          <motion.form
            key="passwordForm"
            onSubmit={passwordFormik.handleSubmit}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="bg-white p-6 rounded-2xl shadow-xl mb-6 space-y-4 w-full md:w-96"
          >
            {renderPasswordInput(
              "currentPassword",
              "password",
              "Current Password",
              "Current Password"
            )}
            {renderPasswordInput(
              "newPassword",
              "password",
              "New Password",
              "New Password"
            )}
            {renderPasswordInput(
              "confirmPassword",
              "password",
              "Confirm New Password",
              "Confirm New Password"
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="submit"
                disabled={passwordFormik.isSubmitting}
                className="bg-green-600 text-white px-4 py-2 cursor-pointer rounded-lg hover:bg-green-700 transition"
              >
                Update Password
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="bg-gray-400 text-white px-4 cursor-pointer py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
