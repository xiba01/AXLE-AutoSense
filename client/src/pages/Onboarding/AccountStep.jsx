import { useState, useEffect } from "react";
import {
  useNavigate,
  useSearchParams,
  Link as RouterLink,
} from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import { Input, Button, Link, Divider, Card, CardBody } from "@heroui/react";
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  Lock,
  RefreshCw,
} from "lucide-react";

export default function AccountStep() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "free";

  // State
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [waitingForEmail, setWaitingForEmail] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // 0. CLEANUP: Ensure no stale sessions interfere when starting fresh
  useEffect(() => {
    if (!waitingForEmail) {
      supabase.auth.signOut();
    }
  }, []);

  // ---------------------------------------------------------
  // 1. 👂 THE MAGIC LISTENER (Strict Mode)
  // ---------------------------------------------------------
  useEffect(() => {
    if (!waitingForEmail) return;

    // Helper: Only pass if explicitly verified
    const checkVerification = (session) => {
      if (session?.user?.email_confirmed_at) {
        console.log("⚡ Verified! Redirecting...");
        navigate(`/onboarding/payment?plan=${selectedPlan}`);
      } else {
        console.log("💤 Session detected, but email not confirmed yet.");
      }
    };

    // A. Listen for Auth Changes (Cross-Tab Sync)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Even if we get SIGNED_IN, we must check if the email is actually confirmed
      if (["SIGNED_IN", "USER_UPDATED", "TOKEN_REFRESHED"].includes(event)) {
        checkVerification(session);
      }
    });

    // B. Polling Backup (Auto-check every 3s)
    const interval = setInterval(async () => {
      // Force refresh to get latest user object from server
      const {
        data: { session },
      } = await supabase.auth.refreshSession();
      checkVerification(session);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [waitingForEmail, navigate, selectedPlan]);

  // ---------------------------------------------------------
  // 2. 📝 MANUAL CHECK
  // ---------------------------------------------------------
  const handleManualCheck = async () => {
    setChecking(true);
    // Reload the session from the server to get the latest 'email_confirmed_at'
    const {
      data: { session },
    } = await supabase.auth.refreshSession();

    if (session?.user?.email_confirmed_at) {
      navigate(`/onboarding/payment?plan=${selectedPlan}`);
    } else {
      setTimeout(() => setChecking(false), 800);
    }
  };

  // ---------------------------------------------------------
  // 3. HANDLERS
  // ---------------------------------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: "dealer",
          },
          // Important: Link back to the payment step
          emailRedirectTo: `${window.location.origin}/onboarding/payment?plan=${selectedPlan}`,
        },
      });

      if (error) throw error;

      console.log("Signup Result:", data);

      // STRICT CHECK:
      // Only skip waiting if the user object has a confirmed timestamp.
      // (Supabase sometimes returns a session immediately even if unverified)
      if (data.session && data.user?.email_confirmed_at) {
        navigate(`/onboarding/payment?plan=${selectedPlan}`);
      } else {
        // Show the waiting screen
        setWaitingForEmail(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // 🎨 VIEW 1: WAITING FOR EMAIL
  // ---------------------------------------------------------
  if (waitingForEmail) {
    return (
      <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500 py-6">
        {/* Animated Mail Icon */}
        <div className="relative mx-auto size-24">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-primary/10 rounded-full size-24 flex items-center justify-center border-2 border-primary/20">
            <Mail className="size-10 text-primary" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-success text-white p-1.5 rounded-full border-4 border-background">
            <CheckCircle2 className="size-4" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">
            Check your inbox
          </h2>
          <p className="text-default-500 max-w-md mx-auto text-lg">
            We sent a confirmation link to <br />
            <span className="font-semibold text-foreground">
              {formData.email}
            </span>
          </p>
        </div>

        {/* Info Card */}
        <Card className="max-w-sm mx-auto border-default-200" shadow="sm">
          <CardBody className="gap-4 text-left p-5">
            <div className="flex gap-3">
              <div className="bg-default-100 p-2 rounded-lg h-fit">
                <span className="text-xl">👆</span>
              </div>
              <div>
                <p className="font-semibold text-small">Click the link</p>
                <p className="text-small text-default-500">
                  Open the email and click the confirmation link.
                </p>
              </div>
            </div>
            <Divider />
            <div className="flex gap-3">
              <div className="bg-default-100 p-2 rounded-lg h-fit">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <p className="font-semibold text-small">Auto-Redirect</p>
                <p className="text-small text-default-500">
                  This page will automatically refresh once you confirm.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Manual Refresh Button */}
        <div className="flex flex-col gap-4 max-w-xs mx-auto">
          <Button
            color="primary"
            variant="shadow"
            size="lg"
            fullWidth
            isLoading={checking}
            onPress={handleManualCheck}
            startContent={!checking && <RefreshCw className="size-4" />}
          >
            I've Verified It
          </Button>

          <Button
            variant="light"
            onPress={() => setWaitingForEmail(false)}
            size="sm"
            className="text-default-500"
          >
            Use a different email
          </Button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // 🎨 VIEW 2: SIGN UP FORM
  // ---------------------------------------------------------
  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
        <p className="text-default-500">
          Step 1 of 3: Secure your dealership access.
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-5">
        {error && (
          <div className="bg-danger-50 border border-danger-200 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="size-5 text-danger" />
            <p className="text-small text-danger font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <Input
            isRequired
            label="Dealership Name"
            placeholder="e.g. Acme Motors"
            name="fullName"
            variant="bordered"
            labelPlacement="outside"
            startContent={<User className="size-4 text-default-400" />}
            onChange={handleChange}
          />

          <Input
            isRequired
            type="email"
            label="Work Email"
            placeholder="admin@dealership.com"
            name="email"
            variant="bordered"
            labelPlacement="outside"
            startContent={<Mail className="size-4 text-default-400" />}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              isRequired
              type="password"
              label="Password"
              placeholder="******"
              name="password"
              variant="bordered"
              labelPlacement="outside"
              startContent={<Lock className="size-4 text-default-400" />}
              onChange={handleChange}
            />
            <Input
              isRequired
              type="password"
              label="Confirm"
              placeholder="******"
              name="confirmPassword"
              variant="bordered"
              labelPlacement="outside"
              startContent={<Lock className="size-4 text-default-400" />}
              onChange={handleChange}
            />
          </div>
        </div>

        <Button
          type="submit"
          color="primary"
          variant="shadow"
          fullWidth
          size="lg"
          isLoading={loading}
          endContent={!loading && <ArrowRight className="size-4" />}
          className="font-semibold"
        >
          Create Account
        </Button>
      </form>

      <div className="flex items-center gap-4 py-2">
        <Divider className="flex-1" />
        <p className="text-tiny text-default-400 uppercase font-bold">Or</p>
        <Divider className="flex-1" />
      </div>

      <div className="text-center">
        <p className="text-small text-default-500">
          Already have an account?{" "}
          <Link
            as={RouterLink}
            to="/login"
            color="primary"
            className="font-medium cursor-pointer"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
