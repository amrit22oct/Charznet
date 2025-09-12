import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

// Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/auth/login", credentials);
      localStorage.setItem("token", data.token);
      return data; // { user, token }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/auth/register", values);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

const initialState = {
   user: JSON.parse(localStorage.getItem("user")) || null,
   token: localStorage.getItem("token") || null,
   loading: false,
   error: null,
   success: false, // 🔹 track registration success
 };
 
 const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
     logout: (state) => {
       state.user = null;
       state.token = null;
       state.error = null;
       state.success = false;
       localStorage.removeItem("user");
       localStorage.removeItem("token");
     },
     clearAuthState: (state) => {  
      state.error = null;
      state.success = false;
    },
   },
   extraReducers: (builder) => {
     builder
       // Register
       .addCase(registerUser.pending, (s) => {
         s.loading = true;
         s.error = null;
         s.success = false;
       })
       .addCase(registerUser.fulfilled, (s) => {
         s.loading = false;
         s.success = true; 
       })
       .addCase(registerUser.rejected, (s, action) => {
         s.loading = false;
         s.error = action.payload;
         s.success = false;
       })
 
       // Login
       .addCase(loginUser.pending, (s) => {
         s.loading = true;
         s.error = null;
       })
       .addCase(loginUser.fulfilled, (s, action) => {
         s.loading = false;
         s.error = null;
         s.user = action.payload.user;
         s.token = action.payload.token;
         localStorage.setItem("user", JSON.stringify(action.payload.user));
         localStorage.setItem("token", action.payload.token);
       })
       .addCase(loginUser.rejected, (s, action) => {
         s.loading = false;
         s.error = action.payload;
       });
   },
 });
 

 
 
 export const { logout, clearAuthState } = authSlice.actions; 
 export default authSlice.reducer;
 
