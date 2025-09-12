import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { Eye, EyeOff, X } from "lucide-react"; // ⬅ Added X icon
import Logo from "../assets/Charznet.png";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(loginUser(values));
    setSubmitting(false);
  };

  // Handle close modal
  const handleClose = () => {
    navigate(-1); // Goes back to previous page (or change to navigate("/") for homepage)
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30  backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative z-50 bg-white p-10 rounded-xl shadow-2xl w-full max-w-md">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        {/* Logo & Heading */}
        <div className="text-center mb-6">
          <img src={Logo} alt="Charznet Logo" className="mx-auto w-16 h-16 mb-3" />
          <h2 className="text-2xl font-bold text-gray-800">
            Sign in to unlock the best of
          </h2>
          <p className="text-purple-600 font-semibold">Charznet</p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Email */}
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                  autoComplete="current-password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Forgot Password */}
              <div className="flex justify-between items-center text-sm">
                <a href="/forgot-password" className="text-purple-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Sign In */}
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Sign In"}
              </button>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="px-2 text-gray-500 text-sm">or sign in with</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

              {/* Google */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span>Google</span>
              </button>

              {/* Register */}
              <p className="text-center text-sm mt-4 text-gray-600">
                Don’t have an account yet?{" "}
                <a
                  href="/register"
                  className="text-purple-600 font-semibold hover:underline"
                >
                  Register
                </a>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
