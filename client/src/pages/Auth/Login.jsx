import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import { Input, Button, Link } from "@heroui/react";
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false); // For password toggle

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // The App.jsx Auth Listener will handle Redux updates automatically
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Welcome back
        </h2>
        <p className="text-sm text-zinc-500">Sign in to your account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
            <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-4 pt-0.5">
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="space-y-2 p-0.5">
            <Input
              isRequired
              label="Password"
              placeholder="Enter your password"
              variant="bordered"
              labelPlacement="outside"
              size="lg"
              classNames={{
                label: "text-sm font-medium text-zinc-700 mb-1.5 ",
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end">
              <Link
                as={RouterLink}
                to="/reset-password"
                size="sm"
                className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={loading}
          endContent={!loading && <ArrowRight className="size-4" />}
          className="bg-zinc-900 text-white font-semibold hover:bg-zinc-800 shadow-sm transition-colors"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {/* Divider with text */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-zinc-500 font-medium">
            New to Axle?
          </span>
        </div>
      </div>

      <div className="text-center">
        <Link
          as={RouterLink}
          to="/onboarding/account?plan=pro"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Create free account
        </Link>
      </div>
    </div>
  );
}
