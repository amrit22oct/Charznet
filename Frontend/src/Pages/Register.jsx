import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthState } from "../redux/slices/authSlice.js";
import Logo from "../assets/Charznet.png";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm your password"),
    terms: Yup.boolean()
      .oneOf([true], "You must accept the Terms & Conditions")
      .required("You must accept the Terms & Conditions"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(registerUser(values));
    setSubmitting(false);
  };

  // Navigate after success
  useEffect(() => {
    if (success) {
      alert("Registered successfully!");
      navigate("/login");
      dispatch(clearAuthState());
    }
  }, [success, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-800">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-6">
          <img src={Logo} alt="Charznet" className="w-16 h-16 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Register</h2>
          <p className="text-sm text-gray-500 mt-1">
            Create an account to unlock the best of Charznet
          </p>
        </div>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Name */}
              <div>
                <Field
                  name="name"
                  placeholder="Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="new-password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <span
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Field
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <span
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </span>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Terms */}
              <div className="flex items-center">
                <Field
                  type="checkbox"
                  name="terms"
                  className="mr-2 h-4 w-4"
                />
                <label className="text-sm text-gray-600">
                  I accept the{" "}
                  <span className="text-indigo-500 cursor-pointer hover:underline">
                    Terms & Conditions
                  </span>
                </label>
              </div>
              <ErrorMessage
                name="terms"
                component="div"
                className="text-red-500 text-sm mt-1"
              />

              {error && <div className="text-red-500 text-sm">{error}</div>}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || isSubmitting}
                className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">Or register with</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google Register */}
        <button
          onClick={() => alert("Google register here")}
          className="w-full flex items-center justify-center border py-2 rounded-md hover:bg-gray-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Google
        </button>

        {/* Footer */}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
