import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicCar } from "../../store/slices/micrositeSlice";
import { supabase } from "../../config/supabaseClient";
import {
  Button,
  Spinner,
  Chip,
  Card,
  CardBody,
  Input,
  Textarea,
  Image,
  Divider,
  Tooltip,
  Progress,
} from "@heroui/react";
import {
  Box,
  CheckCircle2,
  Calendar,
  Gauge,
  Fuel,
  Zap,
  Share2,
  MapPin,
  Info,
  ChevronLeft,
  ChevronRight,
  Heart,
  Printer,
  Phone,
  Mail,
  Clock,
  Shield,
  Award,
  Car,
  Settings,
  Palette,
  Users,
  DollarSign,
  Calculator,
  FileText,
  Star,
  BadgeCheck,
  Camera,
  Play,
  X,
  ZoomIn,
  ExternalLink,
  Rotate3D,
  Eye,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Lazy load the 3D Experience component
const Experience = lazy(() => import("../../components/Showcase/Experience"));

export default function VehicleDetail() {
  const { carId, dealerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { activeCar, loadingCar, error, currentDealer } = useSelector(
    (state) => state.microsite,
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [leadStatus, setLeadStatus] = useState("idle");

  // 3D Viewer State
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const [viewer3DMode, setViewer3DMode] = useState("exterior"); // "exterior" | "interior"
  const [is3DLoading, setIs3DLoading] = useState(false);

  useEffect(() => {
    if (carId && (!activeCar || activeCar.id !== carId)) {
      dispatch(fetchPublicCar(carId));
    }
  }, [carId, dispatch, activeCar]);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setLeadStatus("submitting");

    try {
      const { error } = await supabase.from("leads").insert({
        dealer_id: dealerId,
        car_id: carId,
        customer_name: leadForm.name,
        email: leadForm.email,
        phone: leadForm.phone,
        message: leadForm.message,
      });

      if (error) throw error;
      setLeadStatus("success");
    } catch (err) {
      console.error(err);
      alert("Failed to send message. Please try again.");
      setLeadStatus("idle");
    }
  };

  const handleLaunchExperience = () => {
    if (activeCar?.storyId) {
      navigate(`/experience/${activeCar.storyId}`);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${activeCar.year} ${activeCar.make} ${activeCar.model}`,
          text: `Check out this ${activeCar.year} ${activeCar.make} ${activeCar.model}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handlePrint = () => window.print();

  // ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white text-center p-6">
        <div className="bg-red-50 p-8 rounded-2xl border border-red-100 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="text-red-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Vehicle Not Available
          </h1>
          <p className="text-gray-500 mb-6">
            This vehicle may have been sold or is no longer listed. Browse our
            inventory for similar options.
          </p>
          <Button
            size="lg"
            color="primary"
            onPress={() => navigate(-1)}
            startContent={<ChevronLeft size={18} />}
          >
            Back to Showroom
          </Button>
        </div>
      </div>
    );
  }

  // LOADING STATE
  if (loadingCar || !activeCar) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Car className="text-gray-400 animate-bounce" size={32} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-gray-900 font-medium">Loading Vehicle Details</p>
          <p className="text-gray-400 text-sm mt-1">
            Please wait while we fetch the information...
          </p>
        </div>
        <Progress
          size="sm"
          isIndeterminate
          className="max-w-[200px]"
          aria-label="Loading..."
        />
      </div>
    );
  }

  // Helpers
  const specs = activeCar.specs_raw || {};
  const hasStory = !!activeCar.storyData;
  const brandColor = currentDealer?.primary_color || "#0066FF";
  const photos =
    activeCar.photos?.length > 0
      ? activeCar.photos
      : ["https://placehold.co/1200x800?text=No+Image"];
  const currentPhoto = photos[activeImageIndex];

  // 3D Assets availability
  const has3DModel = !!activeCar.model_3d_url;
  const has360Interior = !!activeCar.image_360_url;
  const has3DExperience = has3DModel || has360Interior;

  // Extract key features for highlights
  const highlights = [
    specs.transmission && { icon: Settings, label: specs.transmission },
    specs.drivetrain && { icon: Car, label: specs.drivetrain },
    specs.exteriorColor && { icon: Palette, label: specs.exteriorColor },
    specs.seating && { icon: Users, label: `${specs.seating} Seats` },
    specs.mpgCity &&
      specs.mpgHighway && {
        icon: Fuel,
        label: `${specs.mpgCity}/${specs.mpgHighway} MPG`,
      },
    specs.engineSize && { icon: Zap, label: specs.engineSize },
  ].filter(Boolean);

  // Spec categories for tabs
  const specCategories = {
    overview: [
      "condition",
      "vin",
      "stockNumber",
      "bodyStyle",
      "doors",
      "seating",
    ],
    performance: [
      "engineSize",
      "engineHp",
      "torque",
      "transmission",
      "drivetrain",
      "fuelType",
    ],
    efficiency: ["mpgCity", "mpgHighway", "fuelCapacity", "range"],
    exterior: ["exteriorColor", "wheelSize", "wheelType"],
    interior: ["interiorColor", "interiorMaterial", "sunroof", "navigation"],
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ============================================
          STICKY HEADER BAR (Mobile-first)
         ============================================ */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline font-medium">Back</span>
          </button>

          <div className="flex-1 text-center px-4">
            <h1 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
              {activeCar.year} {activeCar.make} {activeCar.model}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip content={isFavorited ? "Remove from favorites" : "Save"}>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => setIsFavorited(!isFavorited)}
              >
                <Heart
                  size={18}
                  className={
                    isFavorited ? "fill-red-500 text-red-500" : "text-gray-500"
                  }
                />
              </Button>
            </Tooltip>
            <Tooltip content="Share">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={handleShare}
              >
                <Share2 size={18} className="text-gray-500" />
              </Button>
            </Tooltip>
            <Tooltip content="Print">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={handlePrint}
              >
                <Printer size={18} className="text-gray-500" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ============================================
              LEFT COLUMN (8/12) - Gallery & Details
             ============================================ */}
          <div className="lg:col-span-8 space-y-6">
            {/* IMAGE GALLERY / 3D VIEWER */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {/* Main Image / 3D Viewer Container */}
              <div className="relative aspect-[16/10] bg-gray-100 group">
                {/* Loading Overlay */}
                <AnimatePresence>
                  {is3DLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-30 bg-[#151515] flex items-center justify-center"
                    >
                      <div className="text-center">
                        <div className="relative size-16 mx-auto mb-4">
                          {/* Outer ring */}
                          <div className="absolute inset-0 border-2 border-white/10 rounded-full" />
                          {/* Spinning ring */}
                          <div className="absolute inset-0 border-2 border-transparent border-t-violet-500 border-r-blue-500 rounded-full animate-spin" />
                          {/* Inner icon */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Rotate3D className="text-white/60" size={24} />
                          </div>
                        </div>
                        <p className="text-white font-medium text-sm mb-1">
                          Initializing 3D View
                        </p>
                        <p className="text-white/50 text-xs">Please wait...</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {is3DViewerOpen && has3DExperience ? (
                    // === 3D EXPERIENCE VIEWER ===
                    <motion.div
                      key="3d-viewer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#151515]"
                    >
                      <Suspense
                        fallback={
                          <div className="absolute inset-0 flex items-center justify-center bg-[#151515]">
                            <div className="text-center">
                              <div className="size-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3" />
                              <p className="text-white/60 text-sm">
                                Loading 3D Experience...
                              </p>
                            </div>
                          </div>
                        }
                      >
                        <Experience
                          modelUrl={activeCar.model_3d_url}
                          panoramaUrl={activeCar.image_360_url}
                          mode={viewer3DMode}
                        />
                      </Suspense>

                      {/* 3D Viewer Controls Overlay */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1 rounded-full bg-black/60 backdrop-blur-lg border border-white/10">
                        {has3DModel && (
                          <button
                            onClick={() => setViewer3DMode("exterior")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              viewer3DMode === "exterior"
                                ? "bg-white text-black"
                                : "text-white/70 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            <Car size={16} />
                            Exterior
                          </button>
                        )}
                        {has360Interior && (
                          <button
                            onClick={() => setViewer3DMode("interior")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              viewer3DMode === "interior"
                                ? "bg-white text-black"
                                : "text-white/70 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            <Eye size={16} />
                            Interior 360°
                          </button>
                        )}
                      </div>

                      {/* Fullscreen button */}
                      <button
                        onClick={() => setIsGalleryOpen(true)}
                        className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/80 transition-colors"
                      >
                        <Maximize2 size={18} />
                      </button>
                    </motion.div>
                  ) : (
                    // === PHOTO GALLERY ===
                    <motion.img
                      key={activeImageIndex}
                      src={currentPhoto}
                      alt={`${activeCar.make} ${activeCar.model} - Photo ${activeImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                {/* Overlay badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <Chip
                    size="sm"
                    className="bg-black/70 text-white font-semibold backdrop-blur-sm"
                  >
                    {specs.condition || "Pre-Owned"}
                  </Chip>
                  {has3DExperience && (
                    <Chip
                      size="sm"
                      className="bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold"
                      startContent={<Rotate3D size={12} />}
                    >
                      3D Available
                    </Chip>
                  )}
                </div>

                {/* Photo counter (only when showing photos) */}
                {!is3DViewerOpen && (
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5">
                    <Camera size={14} />
                    {activeImageIndex + 1} / {photos.length}
                  </div>
                )}

                {/* Fullscreen button (for photos) */}
                {!is3DViewerOpen && (
                  <button
                    onClick={() => setIsGalleryOpen(true)}
                    className="absolute bottom-4 right-4 bg-black/60 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/80 transition-colors"
                  >
                    <ZoomIn size={18} />
                  </button>
                )}

                {/* Nav arrows (only for photos) */}
                {!is3DViewerOpen && photos.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === 0 ? photos.length - 1 : prev - 1,
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === photos.length - 1 ? 0 : prev + 1,
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail strip + 3D Toggle */}
              <div className="flex items-center gap-2 p-3 border-t border-gray-100">
                {/* View Toggle */}
                {has3DExperience && (
                  <button
                    onClick={() => {
                      if (!is3DViewerOpen) {
                        setIs3DLoading(true);
                        setViewer3DMode(has3DModel ? "exterior" : "interior");
                        // Small delay to show loader before mounting 3D
                        setTimeout(() => {
                          setIs3DViewerOpen(true);
                          setTimeout(() => setIs3DLoading(false), 500);
                        }, 100);
                      } else {
                        setIs3DViewerOpen(false);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${
                      is3DViewerOpen
                        ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-md"
                        : "bg-foreground/5 text-foreground border border-foreground/10 hover:bg-foreground/10 hover:border-foreground/20"
                    }`}
                  >
                    <Rotate3D size={16} />
                    {is3DViewerOpen ? "Exit 3D" : "View in 3D"}
                  </button>
                )}

                {/* Thumbnail photos - scrollable */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
                  {photos.map((photo, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveImageIndex(i);
                        setIs3DViewerOpen(false);
                      }}
                      className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all ${
                        i === activeImageIndex && !is3DViewerOpen
                          ? "ring-2 ring-offset-2 opacity-100"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      style={{
                        ringColor:
                          i === activeImageIndex && !is3DViewerOpen
                            ? brandColor
                            : "transparent",
                      }}
                    >
                      <img
                        src={photo}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* QUICK HIGHLIGHTS */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {highlights.slice(0, 6).map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-3 text-center border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <item.icon size={20} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-700 font-medium truncate">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* AUTOSENSE EXPERIENCE BANNER */}
            {hasStory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${brandColor}15 0%, ${brandColor}05 100%)`,
                }}
              >
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="relative p-6 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-black to-gray-800 flex items-center justify-center shadow-lg">
                    <Box className="text-white" size={28} />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold text-gray-900">
                      Interactive AutoSense Experience
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Explore this vehicle with immersive visuals, AI-powered
                      narration and feature highlights
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="font-bold text-white shadow-lg"
                    style={{ backgroundColor: brandColor }}
                    startContent={<Play size={18} />}
                    onPress={handleLaunchExperience}
                  >
                    Launch Experience
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ALL SPECS (Expandable) */}
            <details className="bg-white rounded-2xl border border-gray-100 overflow-hidden group">
              <summary className="p-6 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Complete Specifications
                    </h3>
                    <p className="text-sm text-gray-500">
                      View all {Object.keys(specs).length} specifications
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-gray-400 transition-transform group-open:rotate-90"
                />
              </summary>
              <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  {Object.entries(specs).map(([key, val]) => (
                    <div
                      key={key}
                      className="flex justify-between py-2 border-b border-gray-50"
                    >
                      <span className="text-gray-500 text-sm capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="text-gray-900 font-medium text-sm text-right max-w-[50%] truncate">
                        {String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </div>

          {/* ============================================
              RIGHT COLUMN (4/12) - Sticky Sidebar
             ============================================ */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
            {/* PRICE & TITLE CARD */}
            <Card className="shadow-lg border-0 overflow-visible">
              <CardBody className="p-0">
                {/* Price Header */}
                <div
                  className="p-5 text-white rounded-t-xl"
                  style={{
                    background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}dd 100%)`,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/80 text-xs font-medium uppercase tracking-wide">
                        Price
                      </p>
                      <p className="text-3xl font-bold mt-1">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: activeCar.currency || "USD",
                          maximumFractionDigits: 0,
                        }).format(activeCar.price)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Vehicle Title */}
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 leading-tight">
                      {activeCar.year} {activeCar.make} {activeCar.model}
                    </h1>
                    {activeCar.trim && (
                      <p className="text-gray-500 mt-0.5">{activeCar.trim}</p>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <Gauge size={18} className="mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">Mileage</p>
                      <p className="font-semibold text-gray-900">
                        {activeCar.mileage?.toLocaleString() || "N/A"} mi
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <Fuel size={18} className="mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">Fuel Type</p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {specs.fuelType || "Gasoline"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <Settings
                        size={18}
                        className="mx-auto text-gray-400 mb-1"
                      />
                      <p className="text-xs text-gray-500">Transmission</p>
                      <p className="font-semibold text-gray-900">
                        {specs.transmission || "Automatic"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <Zap size={18} className="mx-auto text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">Horsepower</p>
                      <p className="font-semibold text-gray-900">
                        {specs.engineHp || "N/A"} HP
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* CONTACT FORM */}
            <Card className="border border-gray-100">
              <CardBody className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Mail size={18} className="text-gray-500" />
                  <h3 className="font-semibold text-gray-900">
                    Contact About This Vehicle
                  </h3>
                </div>

                {leadStatus === "success" ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-green-50 p-6 rounded-xl text-center border border-green-100"
                  >
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="text-green-600" size={28} />
                    </div>
                    <h4 className="text-green-800 font-bold text-lg">
                      Message Sent!
                    </h4>
                    <p className="text-green-600 text-sm mt-1">
                      A team member will contact you shortly.
                    </p>
                    <Button
                      size="sm"
                      variant="light"
                      className="mt-4"
                      onPress={() => setLeadStatus("idle")}
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-3">
                    <Input
                      isRequired
                      size="sm"
                      label="Full Name"
                      variant="bordered"
                      radius="lg"
                      value={leadForm.name}
                      onChange={(e) =>
                        setLeadForm({ ...leadForm, name: e.target.value })
                      }
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        isRequired
                        size="sm"
                        type="email"
                        label="Email"
                        variant="bordered"
                        radius="lg"
                        value={leadForm.email}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, email: e.target.value })
                        }
                      />
                      <Input
                        size="sm"
                        type="tel"
                        label="Phone"
                        variant="bordered"
                        radius="lg"
                        value={leadForm.phone}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, phone: e.target.value })
                        }
                      />
                    </div>
                    <Textarea
                      size="sm"
                      label="Message"
                      placeholder={`I'm interested in this ${activeCar.year} ${activeCar.make} ${activeCar.model}...`}
                      variant="bordered"
                      radius="lg"
                      minRows={2}
                      value={leadForm.message}
                      onChange={(e) =>
                        setLeadForm({ ...leadForm, message: e.target.value })
                      }
                    />
                    <Button
                      type="submit"
                      isLoading={leadStatus === "submitting"}
                      className="w-full font-semibold text-white"
                      style={{ backgroundColor: brandColor }}
                      radius="lg"
                      size="lg"
                    >
                      Send Inquiry
                    </Button>
                  </form>
                )}
              </CardBody>
            </Card>

            {/* DEALER INFO */}
            {currentDealer && (
              <Card className="border border-gray-100 bg-gray-50">
                <CardBody className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {currentDealer.logo_url ? (
                      <img
                        src={currentDealer.logo_url}
                        alt={currentDealer.name}
                        className="w-10 h-10 rounded-lg object-contain bg-white p-1"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: brandColor }}
                      >
                        {currentDealer.name?.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {currentDealer.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Star
                          size={12}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        <span>4.8 (128 reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    {currentDealer.address && (
                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                        <span>{currentDealer.address}</span>
                      </div>
                    )}
                    {currentDealer.phone && (
                      <a
                        href={`tel:${currentDealer.phone}`}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                      >
                        <Phone size={14} />
                        <span>{currentDealer.phone}</span>
                      </a>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={14} />
                      <span>Open Today: 9AM - 8PM</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="bordered"
                      className="font-medium"
                      startContent={<Phone size={14} />}
                    >
                      Call Now
                    </Button>
                    <Button
                      size="sm"
                      variant="bordered"
                      className="font-medium"
                      startContent={<ExternalLink size={14} />}
                    >
                      Directions
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* ============================================
          FULLSCREEN GALLERY / 3D MODAL
         ============================================ */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Show 3D Viewer in fullscreen if it was active */}
            {is3DViewerOpen && has3DExperience ? (
              <div className="w-full h-full relative">
                <Suspense
                  fallback={
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="size-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                  }
                >
                  <Experience
                    modelUrl={activeCar.model_3d_url}
                    panoramaUrl={activeCar.image_360_url}
                    mode={viewer3DMode}
                  />
                </Suspense>

                {/* Mode Toggle in fullscreen */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1 rounded-full bg-black/60 backdrop-blur-lg border border-white/10">
                  {has3DModel && (
                    <button
                      onClick={() => setViewer3DMode("exterior")}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                        viewer3DMode === "exterior"
                          ? "bg-white text-black"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Car size={16} />
                      Exterior
                    </button>
                  )}
                  {has360Interior && (
                    <button
                      onClick={() => setViewer3DMode("interior")}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                        viewer3DMode === "interior"
                          ? "bg-white text-black"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Eye size={16} />
                      Interior 360°
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                  {activeImageIndex + 1} / {photos.length}
                </div>

                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === 0 ? photos.length - 1 : prev - 1,
                    )
                  }
                  className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft size={28} />
                </button>

                <img
                  src={currentPhoto}
                  alt={`${activeCar.make} ${activeCar.model}`}
                  className="max-w-[90vw] max-h-[85vh] object-contain"
                />

                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === photos.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
