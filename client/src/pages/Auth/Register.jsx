import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import { Car } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "", // We will save this to the dealer profile later
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Car className="mx-auto h-10 w-10 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
          Start your Engine
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create your Axle Dealer account
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2 dark:text-white">
            Dealership / Full Name
          </label>
          <input
            type="text"
            name="fullName"
            required
            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 dark:text-white">
            Email address
          </label>
          <input
            type="email"
            name="email"
            required
            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 dark:text-white">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 decoration-2 hover:underline font-medium"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
