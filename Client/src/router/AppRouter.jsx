import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../features/home/Home';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import Profile from '../features/profile/Profile';

// Optional: layout
import MainLayout from '../components/layouts/MainLayout';
import NotFound from '../components/organisms/NotFound';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter; // 🔹 This default export is crucial
