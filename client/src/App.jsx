import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux"; // <--- Redux Hook
import { supabase } from "./config/supabaseClient";
import { setSession } from "./store/slices/authSlice";

import PrelineLayout from "./components/PrelineLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute"; // <--- We will create this next

import Home from "./pages/Landing/Home";
import Login from "./pages/Auth/Login";
import Inventory from "./pages/Dashboard/Inventory";
import Register from "./pages/Auth/Register";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session));
    });

    // 2. Listen for changes (Sign in, Sign out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <PrelineLayout>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Public Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* <--- ADDED */}
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          {" "}
          {/* <--- The Guard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<div>Dashboard Stats</div>} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="settings" element={<div>Settings Page</div>} />
          </Route>
        </Route>
      </Routes>
    </PrelineLayout>
  );
}

export default App;
