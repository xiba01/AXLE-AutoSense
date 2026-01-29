import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { supabase } from "./config/supabaseClient";
import { setSession } from "./store/slices/authSlice";
import { fetchDealerProfile } from "./store/slices/dealerSlice";

// Layouts & Wrappers
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import OnboardingLayout from "./layouts/OnboardingLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Landing/Home";
import Login from "./pages/Auth/Login";
import Inventory from "./pages/Dashboard/Inventory";
import StudioPage from "./pages/Dashboard/Studio/StudioPage";
import ViewerPage from "./pages/Player/ViewerPage";

// Onboarding Pages
import AccountStep from "./pages/Onboarding/AccountStep";
import PaymentStep from "./pages/Onboarding/PaymentStep";
import BrandingStep from "./pages/Onboarding/BrandingStep";
import EditorPage from "./pages/Dashboard/Studio/EditorPage";

import StudioWizard from "./pages/Dashboard/Studio/Wizard/StudioWizard";

function App() {
  const dispatch = useDispatch();

  // ❌ DELETED: const AccountStep = ... (This was blocking your real component)

  useEffect(() => {
    // 1. Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session));
      if (session?.user) {
        dispatch(fetchDealerProfile(session.user.id));
      }
    });

    // 2. Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
      if (session?.user) {
        dispatch(fetchDealerProfile(session.user.id));
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <Routes>
      {/* 1. PUBLIC LANDING */}
      <Route path="/" element={<Home />} />

      {/* 2. AUTHENTICATION */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* 3. ONBOARDING FUNNEL */}
      <Route path="/onboarding" element={<OnboardingLayout />}>
        {/* ✅ Now this renders the Real Form + Magic Listener */}
        <Route path="account" element={<AccountStep />} />
        <Route path="payment" element={<PaymentStep />} />
        <Route path="branding" element={<BrandingStep />} />
      </Route>

      {/* 4. DEALER DASHBOARD */}
      <Route path="/onboarding" element={<OnboardingLayout />}>
        <Route path="account" element={<AccountStep />} />
        <Route path="payment" element={<PaymentStep />} />
        <Route path="branding" element={<BrandingStep />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        {/* The Layout wraps all inner pages */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Inner Pages */}
          <Route index element={<div>Dashboard Home (Coming Soon)</div>} />
          <Route path="inventory" element={<Inventory />} />
          {/* Index: All Stories */}
          <Route path="studio" element={<StudioPage />} />
          {/* Sub-routes: Filtered Views */}
          <Route path="studio/published" element={<StudioPage />} />
          <Route path="studio/trash" element={<StudioPage />} />

          <Route path="studio/wizard" element={<StudioWizard />} />
          <Route path="editor/:storyId" element={<EditorPage />} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>
      </Route>
      <Route path="/experience/:storyId" element={<ViewerPage />} />
    </Routes>
  );
}

export default App;
