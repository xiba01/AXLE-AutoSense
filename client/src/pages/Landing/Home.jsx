import React from "react";
import { Link } from "react-router-dom";
import { Button, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import {
  Car,
  Sparkles,
  Play,
  Check,
  ArrowRight,
  ChevronRight,
  BarChart3,
  MessageSquare,
  Camera,
  Users,
  TrendingUp,
  Shield,
  Clock,
  Zap,
  Eye,
  DollarSign,
  Gauge,
} from "lucide-react";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Sample car data for hero
const sampleCars = [
  {
    make: "Volkswagen",
    model: "Jetta",
    year: "2024",
    price: "$21,995",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Dacia_Duster_TCe_130_Extreme_%28III%29_%E2%80%93_f_13102024.jpg/330px-Dacia_Duster_TCe_130_Extreme_%28III%29_%E2%80%93_f_13102024.jpg",
  },
  {
    make: "Hyundai",
    model: "Elantra",
    year: "2024",
    price: "$22,750",
    image:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=500&h=350&fit=crop",
  },
  {
    make: "Toyota",
    model: "Corolla",
    year: "2024",
    price: "$22,050",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=350&fit=crop",
  },
];

// Stats data
const stats = [
  { value: "2,400+", label: "Dealerships", icon: Car },
  { value: "1.2M", label: "Vehicles Listed", icon: Gauge },
  { value: "47%", label: "More Test Drives", icon: TrendingUp },
  { value: "3.2x", label: "Lead Conversion", icon: DollarSign },
];

// Features data
const features = [
  {
    icon: Car,
    title: "VIN-Powered Ingestion",
    description:
      "Drop a VIN, get complete specs. Window stickers, market pricing, and feature lists auto-populated in seconds.",
  },
  {
    icon: Sparkles,
    title: "AI Video Stories",
    description:
      "Our AI director analyzes each vehicle and generates cinematic walkthroughs with professional voice-over.",
  },
  {
    icon: Camera,
    title: "3D Digital Showroom",
    description:
      "Let buyers explore every angle online. Interactive 360° views that work on any device, no app needed.",
  },
  {
    icon: MessageSquare,
    title: "AI Sales Assistant",
    description:
      "Answer buyer questions instantly. Our chatbot knows your inventory inside-out and captures leads while you sleep.",
  },
  {
    icon: BarChart3,
    title: "Lot Intelligence",
    description:
      "See which vehicles get attention, track buyer behavior, and know exactly what's moving and what's stale.",
  },
  {
    icon: Eye,
    title: "Branded Microsites",
    description:
      "Your dealership, your brand. White-label showrooms that showcase your inventory with your identity.",
  },
];

// Testimonials
const testimonials = [
  {
    quote:
      "We sold a $92K Range Rover to a buyer who never stepped foot on our lot until pickup. That's the power of Axle's 3D experiences.",
    author: "Mike Santoro",
    role: "Owner, Prestige Imports",
    avatar: "MS",
    metric: "+47% online conversions",
  },
  {
    quote:
      "Our sales team used to spend 3 hours per vehicle on listings. Now it's 5 minutes. The AI writes better copy than we ever did.",
    author: "Rachel Torres",
    role: "GM, AutoNation Select",
    avatar: "RT",
    metric: "12x faster listings",
  },
  {
    quote:
      "Buyers show up knowing the exact trim, color, and features they want. They've already sold themselves through the experience.",
    author: "James Chen",
    role: "Sales Director, Pacific Motors",
    avatar: "JC",
    metric: "2.4x shorter sales cycle",
  },
];

export default function LandingPage() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://lvodepwdbesxputvetnk.supabase.co/storage/v1/object/public/application/AXLE-logo.png"
              alt="Axle"
              className="h-8 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Customers
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              Pricing
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button
                variant="light"
                size="sm"
                className="text-zinc-600 hover:text-zinc-900"
              >
                Sign In
              </Button>
            </Link>
            <Button
              as={Link}
              to="/onboarding/account?plan=free"
              size="sm"
              className="bg-zinc-900 text-white font-medium hover:bg-zinc-800"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-linear-to-br from-zinc-900 via-zinc-900 to-zinc-800 pointer-events-none" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-blue-600/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-linear-to-t from-violet-600/5 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-center lg:text-left"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-4xl pr-8 md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-6 text-white"
              >
                Turn every vehicle into
                <span className="block mt-2 bg-linear-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                  a showroom experience
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg text-zinc-400 max-w-xl mb-8 leading-relaxed"
              >
                AI-powered video stories, immersive 3D walkthroughs, and smart
                lead capture. Everything your lot needs to sell faster online.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
              >
                <Button
                  as={Link}
                  to="/onboarding/account?plan=free"
                  size="lg"
                  className="bg-white text-zinc-900 font-semibold px-8 hover:bg-zinc-100 shadow-lg shadow-white/10"
                  endContent={<ArrowRight size={18} />}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant="bordered"
                  size="lg"
                  className="border-white/20 text-white font-medium px-8 hover:bg-white/10"
                  onClick={() => scrollToSection("demo")}
                  startContent={<Play size={16} />}
                >
                  See It In Action
                </Button>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="mt-6 flex items-center justify-center lg:justify-start"
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                  <span className="text-xs text-zinc-400 font-medium">
                    Powered by
                  </span>
                  <img
                    src="https://lvodepwdbesxputvetnk.supabase.co/storage/v1/object/public/application/AutoSenseLogo.png"
                    alt="AutoSense AI"
                    className="h-5 w-auto brightness-0 invert"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Car Cards Preview */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="relative flex justify-center lg:justify-end"
            >
              {/* Floating car cards */}
              <div className="relative h-120 w-full max-w-lg">
                {sampleCars.map((car, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 0,
                      y: 40,
                      rotate: i === 1 ? 0 : i === 0 ? -3 : 3,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      rotate: i === 1 ? 0 : i === 0 ? -3 : 3,
                    }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}
                    className={`absolute w-[380px] ${
                      i === 0
                        ? "top-0 left-0 z-10"
                        : i === 1
                          ? "top-12 left-8 z-20"
                          : "top-24 left-16 z-30"
                    }`}
                  >
                    <div className="rounded-2xl overflow-hidden bg-white shadow-2xl shadow-black/30 border border-zinc-200">
                      <div className="relative h-52 overflow-hidden bg-zinc-100">
                        <img
                          src={car.image}
                          alt={`${car.year} ${car.make} ${car.model}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                          <Play size={10} fill="white" />
                          3D Ready
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-base text-zinc-500 mb-1">
                              {car.year}
                            </p>
                            <p className="font-semibold text-zinc-900 text-xl">
                              {car.make} {car.model}
                            </p>
                          </div>
                          <p className="text-2xl font-bold text-zinc-900">
                            {car.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="group relative p-6 rounded-2xl border border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-100 transition-all"
              >
                <div className="size-12 rounded-xl bg-zinc-900 flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors">
                  <feature.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-6 bg-zinc-900">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.p
              variants={fadeInUp}
              className="text-sm font-semibold text-blue-400 mb-3 tracking-wide"
            >
              PRICING
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-white"
            >
              Start free. Upgrade when ready.
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-zinc-400 max-w-lg mx-auto"
            >
              No contracts, no hidden fees. Just tools that help you sell.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {/* Starter Plan */}
            <motion.div variants={fadeInUp}>
              <div className="h-full p-8 rounded-2xl border border-zinc-700 bg-zinc-800/50">
                <h3 className="text-xl font-semibold text-white mb-1">
                  Starter
                </h3>
                <p className="text-sm text-zinc-400 mb-6">
                  Try Axle with 1 vehicle
                </p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold text-white">$0</span>
                  <span className="text-zinc-500">/month</span>
                </div>

                <Button
                  as={Link}
                  to="/onboarding/account?plan=free"
                  variant="bordered"
                  size="lg"
                  className="w-full border-zinc-600 text-white font-medium hover:bg-zinc-700"
                >
                  Start for Free
                </Button>

                <div className="mt-8 space-y-4">
                  {[
                    "1 Active Story",
                    "Standard Resolution",
                    "Axle Branding",
                    "Community Support",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-sm text-zinc-300"
                    >
                      <Check size={16} className="text-zinc-500 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div variants={fadeInUp}>
              <div className="relative h-full p-8 rounded-2xl border-2 border-blue-500 bg-zinc-800">
                <Chip
                  size="sm"
                  classNames={{
                    base: "absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500",
                    content: "text-white text-xs font-semibold px-2",
                  }}
                >
                  Best for Dealers
                </Chip>

                <h3 className="text-xl font-semibold text-white mb-1">Pro</h3>
                <p className="text-sm text-zinc-400 mb-6">
                  Unlimited stories for your lot
                </p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold text-white">$49</span>
                  <span className="text-zinc-500">/mo per rooftop</span>
                </div>

                <Button
                  as={Link}
                  to="/onboarding/account?plan=pro"
                  size="lg"
                  className="w-full bg-blue-500 text-white font-semibold hover:bg-blue-600"
                >
                  Get Pro
                </Button>

                <div className="mt-8 space-y-4">
                  {[
                    "Unlimited Vehicle Stories",
                    "4K Cinematic Rendering",
                    "White-label (Your Brand Only)",
                    "AI Chatbot Lead Capture",
                    "Priority Support + Onboarding",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-sm text-zinc-300"
                    >
                      <Check size={16} className="text-blue-400 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center p-12 md:p-16 rounded-3xl bg-linear-to-br from-zinc-900 to-zinc-800 relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />

            <motion.div variants={fadeInUp} className="relative">
              <Car size={48} className="text-white/20 mx-auto mb-6" />
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="relative text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4"
            >
              Your lot deserves more
              <br />
              than a static listing
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="relative text-zinc-400 mb-8 max-w-lg mx-auto"
            >
              Join 2,400+ dealerships using Axle to create immersive experiences
              that convert browsers into buyers.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="relative flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                as={Link}
                to="/onboarding/account?plan=free"
                size="lg"
                className="bg-white text-zinc-900 font-semibold px-8 hover:bg-zinc-100"
                endContent={<ArrowRight size={18} />}
              >
                Start Your Free Trial
              </Button>
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="relative mt-6 text-sm text-zinc-500"
            >
              No credit card required · Set up in 5 minutes
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-16 px-6 bg-zinc-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Link to="/" className="flex items-center gap-2">
                  <img
                    src="https://lvodepwdbesxputvetnk.supabase.co/storage/v1/object/public/application/AXLE-logo.png"
                    alt="Axle"
                    className="h-8 w-auto"
                  />
                </Link>
              </div>
              <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
                The operating system for modern dealerships. AI-powered video
                stories, 3D showrooms, and smart lead capture.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Shield size={14} />
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Clock size={14} />
                  <span>99.9% Uptime</span>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <p className="font-semibold text-zinc-900 mb-4">Product</p>
              <div className="space-y-3">
                <button
                  onClick={() => scrollToSection("features")}
                  className="block text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="block text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection("demo")}
                  className="block text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Demo
                </button>
              </div>
            </div>

            {/* Company */}
            <div>
              <p className="font-semibold text-zinc-900 mb-4">Company</p>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="block text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Customers
                </button>
                <Link
                  to="/onboarding/account?plan=free"
                  className="block text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-400">
              © {new Date().getFullYear()} Axle Technologies, Inc. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
