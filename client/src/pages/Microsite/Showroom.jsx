import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicInventory } from "../../store/slices/micrositeSlice";
import { Spinner, Button, Tabs, Tab, Chip } from "@heroui/react";
import PublicCarCard from "../../components/microsite/PublicCarCard";
import FilterSidebar from "../../components/microsite/FilterSidebar";
import {
  Car,
  Grid3X3,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  Shield,
  Award,
} from "lucide-react";

export default function Showroom() {
  const { dealerId } = useParams();
  const dispatch = useDispatch();
  const { inventory, loadingInventory, currentDealer } = useSelector(
    (state) => state.microsite,
  );
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const brandColor = currentDealer?.primary_color || "#1a1a1a";

  // Fetch cars when dealerId changes
  useEffect(() => {
    if (dealerId) {
      dispatch(fetchPublicInventory(dealerId));
    }
  }, [dispatch, dealerId]);

  // Count cars with AutoSense tours
  const carsWithTours = inventory.filter((c) => c.hasStory).length;

  return (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <div
        className="relative py-20 md:py-28 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}dd 50%, ${brandColor}aa 100%)`,
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Find Your Perfect Vehicle
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
              Browse our curated selection of {inventory.length} premium
              vehicles. Quality assured, competitively priced.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-md rounded-full px-5 py-2.5 border border-white/10">
                <Shield size={18} className="text-white" />
                <span className="text-sm font-semibold">
                  Inspected Vehicles
                </span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-md rounded-full px-5 py-2.5 border border-white/10">
                <Sparkles size={18} className="text-white" />
                <span className="text-sm font-semibold">
                  {carsWithTours} AutoSense Tours
                </span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur-md rounded-full px-5 py-2.5 border border-white/10">
                <Award size={18} className="text-white" />
                <span className="text-sm font-semibold">
                  Best Price Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Results Count + Filter Toggle (Mobile) */}
            <div className="flex items-center gap-4">
              <Button
                variant="flat"
                radius="full"
                size="sm"
                className="lg:hidden bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
                startContent={<SlidersHorizontal size={15} />}
                onPress={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              <p className="text-sm text-gray-600 hidden sm:block font-medium">
                Showing{" "}
                <span className="font-bold text-gray-900">
                  {inventory.length}
                </span>{" "}
                vehicles
              </p>
            </div>

            {/* Right: Sort + View Toggle */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <Button
                variant="flat"
                radius="full"
                size="sm"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs"
                startContent={<ArrowUpDown size={14} />}
              >
                <span className="hidden sm:inline">Sort:</span> Newest
              </Button>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center bg-gray-100 rounded-full p-1 gap-1">
                <Button
                  isIconOnly
                  size="sm"
                  radius="full"
                  variant={viewMode === "grid" ? "solid" : "light"}
                  className={
                    viewMode === "grid"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }
                  onPress={() => setViewMode("grid")}
                >
                  <Grid3X3 size={15} />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  radius="full"
                  variant={viewMode === "list" ? "solid" : "light"}
                  className={
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }
                  onPress={() => setViewMode("list")}
                >
                  <List size={15} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* LEFT: Filters Sidebar */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-72 shrink-0 fixed lg:relative inset-0 lg:inset-auto bg-white lg:bg-transparent z-30 lg:z-auto p-6 lg:p-0 overflow-y-auto`}
          >
            {/* Mobile Close */}
            <div className="lg:hidden flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Filters</h2>
              <Button
                isIconOnly
                variant="light"
                onPress={() => setShowFilters(false)}
              >
                ✕
              </Button>
            </div>
            <FilterSidebar />
          </aside>

          {/* Overlay for mobile filters */}
          {showFilters && (
            <div
              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* RIGHT: Grid */}
          <div className="flex-1 min-w-0">
            {loadingInventory ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Spinner size="lg" color="current" />
                <p className="text-gray-400 text-sm">Loading vehicles...</p>
              </div>
            ) : (
              <>
                {inventory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 text-gray-400 bg-gray-50 rounded-3xl border border-gray-200">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <Car size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">
                      No vehicles available
                    </h3>
                    <p className="text-gray-500">
                      Check back soon for new arrivals!
                    </p>
                  </div>
                ) : (
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {inventory.map((car) => (
                      <PublicCarCard key={car.id} car={car} />
                    ))}
                  </div>
                )}

                {/* Pagination Placeholder */}
                {inventory.length > 0 && (
                  <div className="flex justify-center mt-16">
                    <Button
                      variant="flat"
                      radius="full"
                      size="lg"
                      className="font-semibold bg-gray-900 text-white hover:bg-gray-800 px-8"
                    >
                      Load More Vehicles
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
