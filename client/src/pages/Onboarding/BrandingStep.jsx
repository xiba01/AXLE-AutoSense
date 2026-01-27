import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../config/supabaseClient";
import { updateBranding } from "../../store/slices/dealerSlice";
import { useImageUpload } from "../../hooks/useImageUpload";
import { Input, Button, Card, CardBody, Divider } from "@heroui/react";
import {
  Loader2,
  UploadCloud,
  Image as ImageIcon,
  Play,
  Palette,
  Briefcase,
} from "lucide-react";

// Preset industry colors
const BRAND_COLORS = [
  "#0088ff", // BMW Blue (Default)
  "#E11A2B", // Ferrari Red
  "#1a1a1a", // Audi Black
  "#003319", // Jaguar Green
  "#f59e0b", // Luxury Gold
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
  const [logoPreview, setLogoPreview] = useState(null); // Local preview blob
  const [logoFile, setLogoFile] = useState(null); // Actual file to upload

  // Handlers
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      // Create a fake URL just for immediate preview (before upload)
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFinish = async () => {
    if (!dealershipName) return alert("Please enter a dealership name.");

    setLoading(true);

    try {
      // 1. Upload Logo (If selected)
      let finalLogoUrl = null;
      if (logoFile) {
        finalLogoUrl = await uploadImage(logoFile);
        if (!finalLogoUrl) throw new Error("Logo upload failed");
      }

      // 2. Update Database
      const { error } = await supabase
        .from("dealers")
        .update({
          dealership_name: dealershipName,
          primary_color: primaryColor,
          logo_url: finalLogoUrl,
        })
        .eq("id", user.id);

      if (error) throw error;

      // 3. Update Redux (So dashboard feels instant)
      dispatch(
        updateBranding({
          name: dealershipName,
          color: primaryColor,
          logo: finalLogoUrl,
        }),
      );

      // 4. DONE! Go to Dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong saving your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Design your experience
        </h2>
        <p className="text-default-500">
          This branding will appear on your public car stories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* --- LEFT COLUMN: FORM --- */}
        <div className="space-y-6">
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
          />

          {/* 2. Color Picker */}
          <div>
            <label className="block text-small font-medium text-foreground mb-2 flex items-center gap-2">
              <Palette className="size-4 text-default-400" /> Brand Color
            </label>
            <div className="flex flex-wrap gap-3 p-3 border-2 border-default-200 rounded-medium bg-default-50">
              {BRAND_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setPrimaryColor(color)}
                  className={`size-8 rounded-full border-2 transition-all shadow-sm ${primaryColor === color ? "border-foreground scale-110 ring-2 ring-primary/20" : "border-transparent hover:scale-105"}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
              {/* Custom Color Input */}
              <div className="relative group">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="size-8 p-0 border-0 rounded-full overflow-hidden cursor-pointer opacity-0 absolute inset-0 z-10"
                />
                <div
                  className="size-8 rounded-full border-2 border-default-300 flex items-center justify-center bg-background group-hover:bg-default-100 transition-colors"
                  style={{
                    background: `conic-gradient(from 180deg at 50% 50%, #FF0000 0deg, #00FF00 120deg, #0000FF 240deg, #FF0000 360deg)`,
                  }}
                >
                  <div className="size-6 bg-background rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Logo Upload */}
          <div>
            <label className="block text-small font-medium text-foreground mb-2">
              Logo (Optional)
            </label>
            <label className="group p-6 block border-2 border-dashed border-default-300 rounded-large cursor-pointer hover:border-primary hover:bg-primary/5 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 transition-all">
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleFileSelect}
              />
              <div className="text-center">
                {logoPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={logoPreview}
                      alt="Preview"
                      className="mx-auto h-16 object-contain rounded-md shadow-sm"
                    />
                    <div className="absolute -top-2 -right-2 bg-background rounded-full p-1 shadow-sm border border-default-200">
                      <Loader2
                        className={`size-3 ${isUploadingImage ? "animate-spin" : "hidden"}`}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="size-12 mx-auto bg-default-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud className="size-6 text-default-500 group-hover:text-primary" />
                  </div>
                )}
                <div className="mt-3 flex justify-center text-small text-default-500">
                  <span className="font-medium text-primary group-hover:underline">
                    Click to upload
                  </span>
                  <span className="pl-1">or drag and drop</span>
                </div>
                <p className="text-tiny text-default-400 mt-1">
                  PNG, JPG up to 2MB
                </p>
              </div>
            </label>
            {uploadError && (
              <p className="text-tiny text-danger mt-2">{uploadError}</p>
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: LIVE PREVIEW --- */}
        <Card className="bg-default-50 border-default-200">
          <CardBody className="flex flex-col items-center justify-center relative overflow-hidden p-8 min-h-[300px]">
            <div className="absolute top-4 left-4 text-tiny font-bold text-default-400 uppercase tracking-widest bg-background/50 px-2 py-1 rounded backdrop-blur-sm">
              Live Preview
            </div>

            {/* Simulated Player Card */}
            <div className="w-full max-w-sm bg-background rounded-xl shadow-medium overflow-hidden transform transition-all hover:scale-[1.02] duration-500 border border-default-100">
              {/* Fake Video Area */}
              <div className="h-40 bg-default-900 relative flex items-center justify-center overflow-hidden">
                {/* Abstract Video BG */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-primary/20 opacity-50"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-30"></div>

                <div className="z-10 flex flex-col items-center cursor-pointer group">
                  <div className="size-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="fill-white text-white ml-1 size-5" />
                  </div>
                </div>
              </div>

              {/* Branding Bar */}
              <div className="p-4 border-b border-default-100 flex items-center justify-between bg-background">
                <div className="flex items-center gap-3">
                  {/* Dynamic Logo */}
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      className="h-8 w-auto object-contain"
                      alt="Logo"
                    />
                  ) : (
                    <div className="size-9 bg-default-100 rounded-medium flex items-center justify-center border border-default-200">
                      <ImageIcon className="size-4 text-default-400" />
                    </div>
                  )}
                  {/* Dynamic Name */}
                  <div>
                    <p className="text-[10px] text-default-400 uppercase font-bold tracking-wider">
                      Experience by
                    </p>
                    <p className="text-small font-bold text-foreground leading-tight">
                      {dealershipName || "Your Dealership"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Button Color */}
              <div className="p-4 bg-default-50">
                <button
                  className="w-full py-2.5 rounded-lg text-white text-sm font-medium shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: primaryColor }}
                >
                  Book Test Drive
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Divider />

      {/* --- FINISH BUTTON --- */}
      <div className="flex justify-end">
        <Button
          color="primary"
          size="lg"
          onPress={handleFinish}
          isLoading={loading || isUploadingImage}
          className="font-semibold px-8"
        >
          {loading || isUploadingImage ? "Finalizing..." : "Launch Dashboard"}
        </Button>
      </div>
    </div>
  );
}
