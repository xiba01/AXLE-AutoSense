import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import { Input, Button, Link } from "@heroui/react";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "", // We will save this to the dealer profile later
  });
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create Supabase Auth User
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: "dealer", // Custom metadata
          },
        },
      });

      if (error) throw error;

      // 2. Success! Redirect to Dashboard (or Onboarding)
      // The App.jsx listener will pick up the session automatically
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Create your account
        </h2>
        <p className="text-sm text-zinc-500">Start your free trial today</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
            <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <Input
            isRequired
            type="text"
            label="Full Name"
            placeholder="John Smith"
            variant="bordered"
            labelPlacement="outside"
            size="lg"
            classNames={{
              label: "text-sm font-medium text-zinc-700 mb-1.5",
              input: "text-sm",
              inputWrapper:
                "border-zinc-200 hover:border-zinc-300 focus-within:border-blue-500 data-[hover=true]:border-zinc-300 group-data-[focus=true]:border-blue-500 transition-colors",
            }}
            startContent={
              <User className="size-4 text-zinc-400 pointer-events-none shrink-0" />
            }
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />

          <Input
            isRequired
            type="email"
            label="Email Address"
            placeholder="you@dealership.com"
            variant="bordered"
            labelPlacement="outside"
            size="lg"
            classNames={{
              label: "text-sm font-medium text-zinc-700 mb-1.5",
              input: "text-sm",
              inputWrapper:
                "border-zinc-200 hover:border-zinc-300 focus-within:border-blue-500 data-[hover=true]:border-zinc-300 group-data-[focus=true]:border-blue-500 transition-colors",
            }}
            startContent={
              <Mail className="size-4 text-zinc-400 pointer-events-none shrink-0" />
            }
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <Input
            isRequired
            label="Password"
            placeholder="Create a strong password"
            variant="bordered"
            labelPlacement="outside"
            size="lg"
            classNames={{
              label: "text-sm font-medium text-zinc-700 mb-1.5",
              input: "text-sm",
              inputWrapper:
                "border-zinc-200 hover:border-zinc-300 focus-within:border-blue-500 data-[hover=true]:border-zinc-300 group-data-[focus=true]:border-blue-500 transition-colors",
            }}
            startContent={
              <Lock className="size-4 text-zinc-400 pointer-events-none shrink-0" />
            }
            endContent={
              <button
                className="focus:outline-none hover:opacity-70 transition-opacity"
                type="button"
                onClick={toggleVisibility}
                aria-label="Toggle password visibility"
              >
                {isVisible ? (
                  <EyeOff className="size-4 text-zinc-400" />
                ) : (
                  <Eye className="size-4 text-zinc-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            description="Minimum 6 characters"
          />
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={loading}
          endContent={!loading && <ArrowRight className="size-4" />}
          className="bg-zinc-900 text-white font-semibold hover:bg-zinc-800 shadow-sm transition-colors"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      {/* Divider with text */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-zinc-500 font-medium">
            Already have an account?
          </span>
        </div>
      </div>

      <div className="text-center">
        <Link
          as={RouterLink}
          to="/login"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
