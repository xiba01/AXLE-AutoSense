import React, { useEffect } from "react";
import { Outlet, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicDealer } from "../store/slices/micrositeSlice";
import PublicNavbar from "../components/PublicNavbar";
import { Spinner, Divider } from "@heroui/react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

export default function PublicLayout() {
  const { dealerId } = useParams(); // Get ID from URL
  const dispatch = useDispatch();

  const { currentDealer, loadingDealer, error } = useSelector(
    (state) => state.microsite,
  );

  // 1. Fetch Dealer Data on Mount
  useEffect(() => {
    if (dealerId) {
      dispatch(fetchPublicDealer(dealerId));
    }
  }, [dispatch, dealerId]);

  // 2. Loading State
  if (loadingDealer || !currentDealer) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
        <Spinner size="lg" color="default" />
        <p className="text-gray-400 text-sm">Loading dealership...</p>
      </div>
    );
  }

  // 3. Error State (Invalid ID)
  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white text-center p-4">
        <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Dealership Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The dealership you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="text-primary font-semibold hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  // 4. THEME INJECTION
  const brandColor = currentDealer.primary_color || "#1a1a1a";
  const themeStyle = {
    "--brand-color": brandColor,
  };

  return (
    <div
      className="min-h-screen bg-white font-sans text-foreground flex flex-col"
      style={themeStyle}
    >
      {/* Navigation */}
      <PublicNavbar dealer={currentDealer} />

      {/* Main Content (Showroom / VDP) */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white">
        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Column 1: About */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">
                {currentDealer.dealership_name}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted destination for quality pre-owned and new vehicles.
                We pride ourselves on transparency, competitive pricing, and
                exceptional customer service.
              </p>
              {/* Social Icons */}
              <div className="flex gap-3 pt-2">
                <a
                  href="#"
                  className="size-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="#"
                  className="size-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="#"
                  className="size-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Twitter size={16} />
                </a>
                <a
                  href="#"
                  className="size-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Youtube size={16} />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    to={`/sites/${dealerId}`}
                    className="hover:text-white transition-colors"
                  >
                    Browse Inventory
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Financing Options
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Trade-In Appraisal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Service Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Contact Us</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span>
                    123 Auto Drive
                    <br />
                    City, State 12345
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0" />
                  <a
                    href="tel:+1234567890"
                    className="hover:text-white transition-colors"
                  >
                    (123) 456-7890
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="shrink-0" />
                  <a
                    href="mailto:info@dealer.com"
                    className="hover:text-white transition-colors"
                  >
                    info@dealer.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Hours */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Business Hours</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-white">9AM - 7PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-white">9AM - 5PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-white">Closed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
              <p>
                &copy; {new Date().getFullYear()}{" "}
                {currentDealer.dealership_name}. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
                <span className="text-gray-600">|</span>
                <span>
                  Powered by <span className="font-bold text-white">AXLE</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
