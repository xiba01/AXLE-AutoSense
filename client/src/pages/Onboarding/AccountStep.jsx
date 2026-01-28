import { useState, useEffect } from "react";
import {
  useNavigate,
  useSearchParams,
  Link as RouterLink,
} from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import {
  Input,
  Button,
  Link,
  Divider,
  Card,
  CardBody,
  Checkbox,
} from "@heroui/react";
import { Mail, CheckCircle2, RefreshCw } from "lucide-react";

export default function AccountStep() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "free";

  // State
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [waitingForEmail, setWaitingForEmail] = useState(false);
  const [error, setError] = useState(null);
  const [agreed, setAgreed] = useState(false); // Checkbox state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });

  // 0. CLEANUP
  useEffect(() => {
    if (!waitingForEmail) {
      supabase.auth.signOut();
    }
  }, []);

  // ---------------------------------------------------------
  // 1. MAGIC LISTENER
  // ---------------------------------------------------------
  useEffect(() => {
    if (!waitingForEmail) return;

    const checkVerification = (session) => {
      if (session?.user?.email_confirmed_at) {
        navigate(`/onboarding/payment?plan=${selectedPlan}`);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (["SIGNED_IN", "USER_UPDATED", "TOKEN_REFRESHED"].includes(event)) {
        checkVerification(session);
      }
    });

    const interval = setInterval(async () => {
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
  // 2. HANDLERS
  // ---------------------------------------------------------
  const handleManualCheck = async () => {
    setChecking(true);
    const {
      data: { session },
    } = await supabase.auth.refreshSession();

    if (session?.user?.email_confirmed_at) {
      navigate(`/onboarding/payment?plan=${selectedPlan}`);
    } else {
      setTimeout(() => setChecking(false), 800);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (!agreed) {
      setError("You must agree to the Terms and Privacy Policy.");
      return;
    }

    if (formData.email !== formData.confirmEmail) {
      setError("Email addresses do not match.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: fullName,
            role: "dealer",
          },
          emailRedirectTo: `${window.location.origin}/onboarding/payment?plan=${selectedPlan}`,
        },
      });

      if (error) throw error;

      if (data.session && data.user?.email_confirmed_at) {
        navigate(`/onboarding/payment?plan=${selectedPlan}`);
      } else {
        setWaitingForEmail(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // VIEW 1: WAITING
  // ---------------------------------------------------------
  if (waitingForEmail) {
    return (
      <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500 py-6">
        <div className="relative mx-auto size-24">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-primary/10 rounded-full size-24 flex items-center justify-center border-2 border-primary/20">
            <Mail className="size-10 text-primary" />
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

        <div className="flex flex-col gap-4 max-w-xs mx-auto pt-6">
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
  // VIEW 2: FORM (MATCHING REFERENCE IMAGE)
  // ---------------------------------------------------------
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to AXLE <span className="animate-wave inline-block">👋</span>
        </h1>
        <p className="text-default-500">
          Already have an account?{" "}
          <Link
            as={RouterLink}
            to="/login"
            className="underline text-default-500 hover:text-primary transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-6">
        {error && (
          <div className="bg-danger-50 text-danger px-4 py-3 rounded-medium text-sm font-medium border border-danger-200">
            {error}
          </div>
        )}

        {/* Row 1: Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            isRequired
            label="First Name"
            placeholder="Type your first name here"
            name="firstName"
            variant="flat"
            labelPlacement="outside"
            classNames={{
              inputWrapper:
                "bg-default-100 hover:bg-default-200 focus-within:bg-default-100 data-[hover=true]:bg-default-200",
              label: "font-semibold text-foreground",
            }}
            onChange={handleChange}
          />
          <Input
            isRequired
            label="Last Name"
            placeholder="Type your last name here"
            name="lastName"
            variant="flat"
            labelPlacement="outside"
            classNames={{
              inputWrapper:
                "bg-default-100 hover:bg-default-200 focus-within:bg-default-100 data-[hover=true]:bg-default-200",
              label: "font-semibold text-foreground",
            }}
            onChange={handleChange}
          />
        </div>

        {/* Row 2: Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            isRequired
            type="email"
            label="Email"
            placeholder="john.doe@gmail.com"
            name="email"
            variant="flat"
            labelPlacement="outside"
            classNames={{
              inputWrapper:
                "bg-default-100 hover:bg-default-200 focus-within:bg-default-100 data-[hover=true]:bg-default-200",
              label: "font-semibold text-foreground",
            }}
            onChange={handleChange}
          />
          <Input
            isRequired
            type="email"
            label="Confirm Email"
            placeholder="john.doe@gmail.com"
            name="confirmEmail"
            variant="flat"
            labelPlacement="outside"
            classNames={{
              inputWrapper:
                "bg-default-100 hover:bg-default-200 focus-within:bg-default-100 data-[hover=true]:bg-default-200",
              label: "font-semibold text-foreground",
            }}
            onChange={handleChange}
          />
        </div>

        {/* Row 3: Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            isRequired
            type="password"
            label="Password"
            placeholder="********"
            name="password"
            variant="flat"
            labelPlacement="outside"
            classNames={{
              inputWrapper:
                "bg-default-100 hover:bg-default-200 focus-within:bg-default-100 data-[hover=true]:bg-default-200",
              label: "font-semibold text-foreground",
            }}
            onChange={handleChange}
          />
          <Input
            isRequired
            type="password"
            label="Confirm Password"
            placeholder="********"
            name="confirmPassword"
            variant="flat"
            labelPlacement="outside"
            classNames={{
              inputWrapper:
                "bg-default-100 hover:bg-default-200 focus-within:bg-default-100 data-[hover=true]:bg-default-200",
              label: "font-semibold text-foreground",
            }}
            onChange={handleChange}
          />
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            isSelected={agreed}
            onValueChange={setAgreed}
            classNames={{
              wrapper: "before:border-default-400 after:bg-primary",
            }}
          >
            <span className="text-sm text-default-600">
              I read and agree with the{" "}
              <Link
                href="#"
                className="text-foreground underline underline-offset-2 font-medium"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="text-foreground underline underline-offset-2 font-medium"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </Checkbox>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="bg-transparent border-2 border-foreground text-foreground hover:bg-foreground hover:text-background font-semibold rounded-full px-8 py-6 text-md transition-all"
          variant="bordered"
          isLoading={loading}
        >
          {loading ? "Creating Account..." : "Sign Up for Free"}
        </Button>
      </form>
    </div>
  );
}
