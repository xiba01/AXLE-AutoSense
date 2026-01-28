import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import { Input, Button, Link, Divider } from "@heroui/react";
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
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
        <p className="text-small text-default-500">
          Sign in to manage your inventory
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-8">
        {/* Error Alert */}
        {error && (
          <div className="bg-danger-50 border border-danger-200 p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="size-4 text-danger shrink-0" />
            <p className="text-tiny text-danger font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <Input
            isRequired
            type="email"
            label="Email"
            placeholder="admin@dealership.com"
            variant="bordered"
            labelPlacement="outside"
            startContent={
              <Mail className="size-4 text-default-400 pointer-events-none" />
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pb-4"
          />

          <Input
            isRequired
            label="Password"
            placeholder="Enter your password"
            variant="bordered"
            labelPlacement="outside"
            startContent={
              <Lock className="size-4 text-default-400 pointer-events-none" />
            }
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeOff className="size-4 text-default-400" />
                ) : (
                  <Eye className="size-4 text-default-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          color="primary"
          variant="shadow"
          fullWidth
          isLoading={loading}
          endContent={!loading && <ArrowRight className="size-4" />}
          className="font-semibold"
        >
          Sign In
        </Button>
      </form>

      <Divider />

      <div className="text-center">
        <p className="text-small text-default-500">
          Don't have an account?{" "}
          <Link
            as={RouterLink}
            to="/onboarding/account?plan=pro"
            color="primary"
            className="font-medium cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
