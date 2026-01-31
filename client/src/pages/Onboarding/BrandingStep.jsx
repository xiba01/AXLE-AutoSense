import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../config/supabaseClient";
import { updateBranding } from "../../store/slices/dealerSlice";
import { useImageUpload } from "../../hooks/useImageUpload";
import {
  Input,
  Button,
  Card,
  CardBody,
  Divider,
  Skeleton,
} from "@heroui/react";
import {
  Loader2,
  UploadCloud,
  Image as ImageIcon,
  Palette,
  Briefcase,
  MousePointer2,
  Menu,
  ChevronRight,
} from "lucide-react";

// Preset industry colors
const BRAND_COLORS = [
  "#0088ff", // BMW Blue
  "#E11A2B", // Ferrari Red
  "#1a1a1a", // Audi Black
  "#003319", // Jaguar Green
  "#f59e0b", // Luxury Gold
  "#6d28d9", // Royal Purple
];

export default function BrandingStep() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Custom Hook for storage
  const {
    uploadImage,
    uploading: isUploadingImage,
    error: uploadError,
  } = useImageUpload("dealerships-logo");

  // Local State
  const [loading, setLoading] = useState(false);
  const [dealershipName, setDealershipName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#0088ff");
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  // Handlers
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFinish = async () => {
    if (!dealershipName) return alert("Please enter a dealership name.");

    setLoading(true);

    try {
      let finalLogoUrl = null;
      if (logoFile) {
        finalLogoUrl = await uploadImage(logoFile);
        if (!finalLogoUrl) throw new Error("Logo upload failed");
      }

      const { error } = await supabase
        .from("dealers")
        .update({
          dealership_name: dealershipName,
          primary_color: primaryColor,
          logo_url: finalLogoUrl,
        })
        .eq("id", user.id);

      if (error) throw error;

      dispatch(
        updateBranding({
          name: dealershipName,
          color: primaryColor,
          logo: finalLogoUrl,
        }),
      );

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong saving your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Brand Identity</h2>
          <p className="text-default-500 mt-1">
            Customize how your AutoSense stories look to customers.
          </p>
        </div>
        <div className="hidden md:block">
          <Button
            color="primary"
            size="lg"
            onPress={handleFinish}
            isLoading={loading || isUploadingImage}
            className="font-semibold shadow-lg shadow-primary/20"
          >
            {loading || isUploadingImage ? "Finalizing..." : "Launch Dashboard"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* --- LEFT COLUMN: SETTINGS (5 Cols) --- */}
        <div className="lg:col-span-5 space-y-8">
          <Card className="bg-default-50 shadow-none">
            <CardBody className="p-6 space-y-6">
              {/* 1. Name Input */}
              <Input
                isRequired
                label="Dealership Name"
                placeholder="e.g. Prestige Imports"
                variant="bordered"
                labelPlacement="outside"
                startContent={<Briefcase className="size-4 text-default-400" />}
                value={dealershipName}
                onChange={(e) => setDealershipName(e.target.value)}
                classNames={{
                  inputWrapper: "bg-background",
                }}
              />

              {/* 2. Color Picker */}
              <div>
                <label className="block text-small font-medium text-foreground mb-3 flex items-center gap-2">
                  <Palette className="size-4 text-default-400" /> Accent Color
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {BRAND_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setPrimaryColor(color)}
                      className={`
                        aspect-square rounded-xl border-2 transition-all shadow-sm flex items-center justify-center
                        ${
                          primaryColor === color
                            ? "border-foreground scale-110 ring-2 ring-offset-2 ring-primary/20"
                            : "border-transparent hover:scale-105"
                        }
                      `}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                  {/* Custom Color Input */}
                  <div className="relative group aspect-square">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full h-full rounded-xl border-2 border-default-200 flex items-center justify-center bg-background group-hover:border-default-400 transition-colors overflow-hidden">
                      <div className="w-full h-full bg-[conic-gradient(from_180deg_at_50%_50%,#FF0000_0deg,#00FF00_120deg,#0000FF_240deg,#FF0000_360deg)] opacity-80" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Logo Upload */}
              <div>
                <label className="block text-small font-medium text-foreground mb-3">
                  Logo / Avatar
                </label>
                <label
                  className={`
                    group relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all overflow-hidden
                    ${logoPreview ? "border-primary bg-primary/5" : "border-default-300 hover:border-primary hover:bg-default-100"}
                  `}
                >
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />

                  {logoPreview ? (
                    <div className="relative w-full h-full p-4 flex items-center justify-center">
                      <img
                        src={logoPreview}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain drop-shadow-md"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium backdrop-blur-sm">
                        Change Logo
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="p-3 bg-default-100 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud className="size-6 text-default-500" />
                      </div>
                      <p className="mb-1 text-sm text-default-500">
                        <span className="font-semibold text-primary">
                          Click to upload
                        </span>
                      </p>
                      <p className="text-xs text-default-400">
                        SVG, PNG, JPG (Max 2MB)
                      </p>
                    </div>
                  )}

                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20">
                      <Loader2 className="animate-spin text-primary" />
                    </div>
                  )}
                </label>
                {uploadError && (
                  <p className="text-tiny text-danger mt-2 flex items-center gap-1">
                    <span className="inline-block size-1.5 rounded-full bg-danger" />{" "}
                    {uploadError}
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* --- RIGHT COLUMN: ABSTRACT PREVIEW (7 Cols) --- */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <div className="sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-default-400">
                You Website Preview
              </span>
              <div className="flex gap-2">
                <div className="size-3 rounded-full bg-default-200" />
                <div className="size-3 rounded-full bg-default-200" />
              </div>
            </div>

            {/* THE BROWSER WINDOW MOCKUP */}
            <div className="w-full aspect-[16/10] bg-black rounded-2xl overflow-hidden shadow-2xl border border-default-200 relative ring-4 ring-default-100">
              {/* 1. MOCK NAVBAR */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-black/40 backdrop-blur-md border-b border-white/10 z-20 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                  {/* Dynamic Logo */}
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      className="h-8 w-auto object-contain"
                      alt="Logo"
                    />
                  ) : (
                    <div className="size-8 rounded bg-white/10 flex items-center justify-center">
                      <ImageIcon className="size-4 text-white/50" />
                    </div>
                  )}
                  {/* Dynamic Name */}
                  <span className="text-white font-semibold text-sm tracking-wide">
                    {dealershipName || "YOUR DEALERSHIP"}
                  </span>
                </div>
                <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-colors">
                  <Menu className="text-white size-5" />
                </div>
              </div>

              {/* 2. BACKGROUND SCENE (Abstract Car) */}
              <div className="absolute inset-0 bg-neutral-900">
                {/* Dynamic Ambient Glow based on Primary Color */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] opacity-30 blur-[100px] transition-colors duration-700"
                  style={{ backgroundColor: primaryColor }}
                />

                {/* Abstract Grid Floor */}
                <div className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(to_bottom,transparent,black),repeating-linear-gradient(90deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_40px)] perspective-grid"></div>
              </div>

              {/* 3. INTERACTIVE OVERLAYS */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-8">
                {/* Hero Text */}
                <div className="mb-6 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                    <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-medium text-white uppercase tracking-wider">
                      Inventory
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-white leading-tight">
                    Experience the <br />
                    Future of Driving.
                  </h1>
                </div>

                {/* The Main CTA Button (Dynamic Color) */}
                <div className="flex items-center gap-4">
                  <button
                    className="h-12 px-6 rounded-lg text-white text-sm font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Start Experience <ChevronRight size={16} />
                  </button>

                  {/* Floating Cursor (Visual Polish) */}
                  <div className="absolute bottom-6 left-48 animate-bounce delay-700 opacity-80">
                    <MousePointer2 className="fill-white text-black size-6 drop-shadow-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only Launch Button (Desktop button is in header) */}
      <div className="md:hidden pt-4">
        <Button
          color="primary"
          size="lg"
          fullWidth
          onPress={handleFinish}
          isLoading={loading || isUploadingImage}
          className="font-semibold shadow-lg shadow-primary/20"
        >
          {loading || isUploadingImage ? "Finalizing..." : "Launch Dashboard"}
        </Button>
      </div>
    </div>
  );
}
