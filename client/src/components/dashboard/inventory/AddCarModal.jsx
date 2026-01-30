import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Tabs,
  Tab,
} from "@heroui/react";
import {
  UploadCloud,
  Search,
  X,
  Save,
  Cpu,
  Info,
  Layers,
  Sparkles,
  Check,
  Box,
  Image,
} from "lucide-react";

import { fetchTrimSpecs } from "../../../services/carSpecsService";
import { addCar, updateCar } from "../../../store/slices/inventorySlice";
import { v4 as uuidv4 } from "uuid";
import SpecsDrawer from "./SpecsDrawer";

export default function AddCarModal({ isOpen, onClose, initialData }) {
  const dispatch = useDispatch();

  // --- 1. STATE MANAGEMENT ---

  // A. Loading States
  const [isFetching, setIsFetching] = useState(false); // RapidAPI
  const [isSaving, setIsSaving] = useState(false); // Supabase

  // B. The Data
  const [trimId, setTrimId] = useState("");
  const [mainInfo, setMainInfo] = useState({
    vin: "",
    make: "",
    model: "",
    year: "",
    trim: "", // Name of trim (e.g. "M Sport")
    bodyType: "",
    price: "",
    currency: "USD",
    mileage: "",
    condition: "Used",
    color: "",
  });

  // C. The Technical Specs (List for the Drawer)
  const [techSpecs, setTechSpecs] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // C2. Active Tab for right column
  const [activeTab, setActiveTab] = useState("details");

  // D. Visuals
  const [photoFiles, setPhotoFiles] = useState([]); // File Objects (for upload)
  const [photoPreviews, setPhotoPreviews] = useState([]); // Blob URLs (for UI)
  const [existingPhotos, setExistingPhotos] = useState([]); // Existing URLs from DB
  const fileInputRef = useRef(null);

  // E. 3D Assets
  const [model3dFile, setModel3dFile] = useState(null);
  const [model3dPreview, setModel3dPreview] = useState(null); // filename or existing URL
  const [image360File, setImage360File] = useState(null);
  const [image360Preview, setImage360Preview] = useState(null);
  const model3dInputRef = useRef(null);
  const image360InputRef = useRef(null);

  // --- EFFECT: PRE-FILL WHEN EDITING ---
  React.useEffect(() => {
    if (initialData) {
      setMainInfo({
        vin: initialData.vin || "",
        make: initialData.make || "",
        model: initialData.model || "",
        year: initialData.year || "",
        trim: initialData.trim || "",
        bodyType: initialData.specs_raw?.bodyType || "",
        price: initialData.price || "",
        currency: initialData.currency || "USD",
        mileage: initialData.mileage || "",
        condition: initialData.specs_raw?.condition || "Used",
        color: initialData.specs_raw?.color_name || "",
      });

      if (initialData.specs_raw) {
        const list = Object.entries(initialData.specs_raw)
          .filter(([key]) => key !== "color_name" && key !== "condition")
          .map(([key, value]) => ({
            id: uuidv4(),
            key,
            label: key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase()),
            value: String(value),
          }));
        setTechSpecs(list);
      }

      setExistingPhotos(initialData.photos || []);
      setPhotoPreviews(initialData.photos || []);
      setPhotoFiles([]);
      setTrimId(initialData.trimId || "");

      // Pre-fill 3D assets
      setModel3dPreview(initialData.model_3d_url || null);
      setImage360Preview(initialData.image_360_url || null);
      setModel3dFile(null);
      setImage360File(null);
    } else {
      setMainInfo({
        vin: "",
        make: "",
        model: "",
        year: "",
        trim: "",
        bodyType: "",
        price: "",
        currency: "USD",
        mileage: "",
        condition: "Used",
        color: "",
      });
      setTechSpecs([]);
      setPhotoPreviews([]);
      setPhotoFiles([]);
      setExistingPhotos([]);
      setTrimId("");
      setModel3dFile(null);
      setModel3dPreview(null);
      setImage360File(null);
      setImage360Preview(null);
    }
  }, [initialData, isOpen]);

  // --- 2. HANDLERS: DATA & API ---

  const handleInputChange = (field, value) => {
    setMainInfo((prev) => ({ ...prev, [field]: value }));
  };

  // The Magic Button Logic
  const handleFetch = async () => {
    if (!trimId) return;
    setIsFetching(true);

    try {
      // Call our Service (Part 1)
      const data = await fetchTrimSpecs(trimId);

      if (data) {
        // Auto-fill Core Fields
        setMainInfo((prev) => ({
          ...prev,
          make: data.identity.make,
          model: data.identity.model,
          year: data.identity.year,
          trim: data.identity.trim,
          bodyType: data.identity.bodyType,
        }));

        // Populate the Sidebar List
        setTechSpecs(data.specsList);
      }
    } catch (error) {
      alert("Failed to fetch specs. Check Trim ID.");
    } finally {
      setIsFetching(false);
    }
  };

  // --- 3. HANDLERS: IMAGES ---

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      setPhotoFiles((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPhotoPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removePhoto = (index) => {
    const numExisting = existingPhotos.length;

    if (index < numExisting) {
      setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
    } else {
      const fileIndex = index - numExisting;
      setPhotoFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }

    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // --- 4. HANDLER: SAVE TO DB ---

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (initialData) {
        await dispatch(
          updateCar({
            carId: initialData.id,
            formData: mainInfo,
            specsList: techSpecs,
            photos: photoFiles,
            existingPhotos,
            model3dFile,
            image360File,
            existing3dUrl: model3dFile ? null : model3dPreview,
            existing360Url: image360File ? null : image360Preview,
          }),
        ).unwrap();
      } else {
        await dispatch(
          addCar({
            formData: mainInfo,
            specsList: techSpecs,
            photos: photoFiles,
            model3dFile,
            image360File,
          }),
        ).unwrap();
      }

      onClose();
    } catch (error) {
      alert("Failed to save car: " + error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        size="5xl"
        scrollBehavior="inside"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-0">
                <span className="text-xl font-semibold text-foreground">
                  {initialData ? "Edit Vehicle" : "Add New Vehicle"}
                </span>
                <span className="text-sm text-foreground/50 font-normal">
                  {initialData
                    ? `Updating: ${initialData.vin}`
                    : "Import from API or enter manually"}
                </span>
              </ModalHeader>

              <ModalBody className="gap-8 py-6">
                {/* Photos Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Layers className="size-4 text-foreground/40" />
                      <h3 className="text-sm font-medium text-foreground">
                        Photos
                      </h3>
                    </div>
                    <span className="text-xs text-foreground/40">
                      {photoPreviews.length} selected
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {/* Upload Button */}
                    <div
                      onClick={() => fileInputRef.current.click()}
                      className="aspect-[4/3] rounded-xl border border-dashed border-foreground/15 hover:border-foreground/30 hover:bg-foreground/[0.02] cursor-pointer flex flex-col items-center justify-center transition-all group"
                    >
                      <UploadCloud className="size-5 text-foreground/30 group-hover:text-foreground/50 mb-1.5" />
                      <span className="text-xs text-foreground/40 group-hover:text-foreground/60">
                        Add Photos
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                      />
                    </div>

                    {/* Thumbnails */}
                    {photoPreviews.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-[4/3] group rounded-xl overflow-hidden border border-foreground/10"
                      >
                        <img
                          src={src}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1.5 right-1.5 size-6 bg-black/60 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-foreground/6" />

                {/* Form Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: API Import */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-foreground/40" />
                      <h3 className="text-sm font-medium text-foreground">
                        Data Import
                      </h3>
                    </div>

                    <div className="p-4 rounded-xl bg-foreground/[0.02] border border-foreground/[0.06] space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-foreground/50">
                          RapidAPI Trim ID
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. 128478"
                            value={trimId}
                            onChange={(e) => setTrimId(e.target.value)}
                            className="flex-1 px-3 py-2 text-sm bg-background border border-foreground/10 rounded-lg focus:outline-none focus:border-foreground/20 transition-colors"
                          />
                          <button
                            onClick={handleFetch}
                            disabled={!trimId || isFetching}
                            className="px-3 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                          >
                            {isFetching ? (
                              <div className="size-4 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                            ) : (
                              <Search className="size-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-foreground/40">
                          Find ID in Car Specs API
                        </p>
                      </div>

                      {techSpecs.length > 0 && (
                        <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 text-emerald-600 rounded-lg">
                          <Check className="size-4" />
                          <span className="text-xs font-medium">
                            Loaded {techSpecs.length} specs
                          </span>
                        </div>
                      )}

                      <button
                        disabled={techSpecs.length === 0}
                        onClick={() => setIsDrawerOpen(true)}
                        className="w-full px-4 py-2.5 text-sm font-medium rounded-lg bg-foreground/5 hover:bg-foreground/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        <Cpu className="size-4" />
                        {techSpecs.length > 0
                          ? "Review Specs"
                          : "Waiting for data..."}
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Tabbed Content */}
                  <div className="lg:col-span-2 space-y-4">
                    <Tabs
                      selectedKey={activeTab}
                      onSelectionChange={setActiveTab}
                      variant="underlined"
                      classNames={{
                        tabList:
                          "gap-6 w-full relative rounded-none p-0 border-b border-foreground/10",
                        cursor: "w-full bg-foreground",
                        tab: "max-w-fit px-0 h-10",
                        tabContent:
                          "group-data-[selected=true]:text-foreground text-foreground/50",
                      }}
                    >
                      <Tab
                        key="details"
                        title={
                          <div className="flex items-center gap-2">
                            <Info className="size-4" />
                            <span className="text-sm font-medium">
                              Vehicle Details
                            </span>
                          </div>
                        }
                      >
                        <div className="space-y-4 pt-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs text-foreground/50">
                                VIN *
                              </label>
                              <input
                                type="text"
                                placeholder="17 characters"
                                value={mainInfo.vin}
                                onChange={(e) =>
                                  handleInputChange("vin", e.target.value)
                                }
                                className="w-full px-3 py-2 text-sm bg-background border border-foreground/10 rounded-lg focus:outline-none focus:border-foreground/20 transition-colors"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs text-foreground/50">
                                Make *
                              </label>
                              <input
                                type="text"
                                value={mainInfo.make}
                                onChange={(e) =>
                                  handleInputChange("make", e.target.value)
                                }
                                className="w-full px-3 py-2 text-sm bg-background border border-foreground/10 rounded-lg focus:outline-none focus:border-foreground/20 transition-colors"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs text-foreground/50">
                                Model *
                              </label>
                              <input
                                type="text"
                                value={mainInfo.model}
                                onChange={(e) =>
                                  handleInputChange("model", e.target.value)
                                }
                                className="w-full px-3 py-2 text-sm bg-background border border-foreground/10 rounded-lg focus:outline-none focus:border-foreground/20 transition-colors"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs text-foreground/50">
                                Year *
                              </label>
                              <input
                                type="number"
                                value={mainInfo.year}
                                onChange={(e) =>
                                  handleInputChange("year", e.target.value)
                                }
                                className="w-full px-3 py-2 text-sm bg-background border border-foreground/10 rounded-lg focus:outline-none focus:border-foreground/20 transition-colors"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs text-foreground/50">
                                Trim / Series
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. M Sport"
                                value={mainInfo.trim}
                                onChange={(e) =>
                                  handleInputChange("trim", e.target.value)
                                }
                                className="w-full px-3 py-2 text-sm bg-background border border-foreground/10 rounded-lg focus:outline-none focus:border-foreground/20 transition-colors"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs text-foreground/50">
                                Color
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Alpine White"
                                value={mainInfo.color}
                                onChange={(e) =>
                                  handleInputChange("color", e.target.value)
                                }
                                className="w-full px-3 py-2 text-sm bg-background border border-foreground/10 rounded-lg focus:outline-none focus:border-foreground/20 transition-colors"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-xs text-foreground/50">
                                Price
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground/40">
                                  $
                                </span>
                                <input
                                  type="number"
                                  value={mainInfo.price}
                                  onChange={(e) =>
                                    handleInputChange("price", e.target.value)
                                  }
                                  className="w-full pl-7 pr-3 py-2 text-sm bg-background border border-foreground/10 rounded-lg focus:outline-none focus:border-foreground/20 transition-colors"
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs text-foreground/50">
                                Mileage
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  value={mainInfo.mileage}
                                  onChange={(e) =>
                                    handleInputChange("mileage", e.target.value)
                                  }
                                  className="w-full px-3 py-2 text-sm bg-background border border-foreground/10 rounded-lg focus:outline-none focus:border-foreground/20 transition-colors"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground/40">
                                  mi
                                </span>
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs text-foreground/50">
                                Condition
                              </label>
                              <Select
                                aria-label="Condition"
                                selectedKeys={[mainInfo.condition]}
                                onChange={(e) =>
                                  handleInputChange("condition", e.target.value)
                                }
                                classNames={{
                                  trigger:
                                    "h-[38px] min-h-[38px] bg-background border border-foreground/10 rounded-lg",
                                  value: "text-sm",
                                }}
                              >
                                <SelectItem key="New">New</SelectItem>
                                <SelectItem key="Used">Used</SelectItem>
                                <SelectItem key="CPO">CPO</SelectItem>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </Tab>

                      <Tab
                        key="assets"
                        title={
                          <div className="flex items-center gap-2">
                            <Box className="size-4" />
                            <span className="text-sm font-medium">
                              3D Assets
                            </span>
                            {(model3dFile ||
                              model3dPreview ||
                              image360File ||
                              image360Preview) && (
                              <div className="size-1.5 rounded-full bg-emerald-500" />
                            )}
                          </div>
                        }
                      >
                        <div className="space-y-4 pt-4">
                          <p className="text-sm text-foreground/50">
                            Upload optional 3D assets for an immersive viewing
                            experience on the public vehicle page.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 3D Model Upload */}
                            <div className="space-y-2">
                              <label className="text-xs text-foreground/50 font-medium">
                                3D Model (.glb)
                              </label>
                              <div
                                onClick={() => model3dInputRef.current?.click()}
                                className="relative aspect-3/2 rounded-xl border border-dashed border-foreground/15 hover:border-foreground/30 hover:bg-foreground/2 cursor-pointer flex flex-col items-center justify-center transition-all group overflow-hidden"
                              >
                                {model3dPreview || model3dFile ? (
                                  <>
                                    <div className="absolute inset-0 bg-linear-to-br from-violet-500/10 to-blue-500/10 flex items-center justify-center">
                                      <Box className="size-10 text-foreground/30" />
                                    </div>
                                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg truncate">
                                      {model3dFile?.name || "Model uploaded"}
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setModel3dFile(null);
                                        setModel3dPreview(null);
                                      }}
                                      className="absolute top-2 right-2 size-6 bg-black/60 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                                    >
                                      <X className="size-3" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <Box className="size-6 text-foreground/30 group-hover:text-foreground/50 mb-1.5" />
                                    <span className="text-xs text-foreground/40 group-hover:text-foreground/60">
                                      Upload GLB
                                    </span>
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept=".glb"
                                  className="hidden"
                                  ref={model3dInputRef}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setModel3dFile(file);
                                      setModel3dPreview(file.name);
                                    }
                                  }}
                                />
                              </div>
                            </div>

                            {/* 360 Image Upload */}
                            <div className="space-y-2">
                              <label className="text-xs text-foreground/50 font-medium">
                                Interior 360° (.jpg)
                              </label>
                              <div
                                onClick={() =>
                                  image360InputRef.current?.click()
                                }
                                className="relative aspect-3/2 rounded-xl border border-dashed border-foreground/15 hover:border-foreground/30 hover:bg-foreground/2 cursor-pointer flex flex-col items-center justify-center transition-all group overflow-hidden"
                              >
                                {image360Preview || image360File ? (
                                  <>
                                    {image360Preview?.startsWith("http") ||
                                    image360Preview?.startsWith("blob:") ? (
                                      <img
                                        src={image360Preview}
                                        alt="360 preview"
                                        className="absolute inset-0 w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center">
                                        <Image className="size-10 text-foreground/30" />
                                      </div>
                                    )}
                                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg truncate">
                                      {image360File?.name || "360° uploaded"}
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setImage360File(null);
                                        setImage360Preview(null);
                                      }}
                                      className="absolute top-2 right-2 size-6 bg-black/60 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                                    >
                                      <X className="size-3" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <Image className="size-6 text-foreground/30 group-hover:text-foreground/50 mb-1.5" />
                                    <span className="text-xs text-foreground/40 group-hover:text-foreground/60">
                                      Upload 360°
                                    </span>
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg"
                                  className="hidden"
                                  ref={image360InputRef}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setImage360File(file);
                                      setImage360Preview(
                                        URL.createObjectURL(file),
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="border-t border-foreground/6 pt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-xl hover:bg-foreground/90 disabled:opacity-60 transition-all"
                >
                  {isSaving ? (
                    <div className="size-4 border-2 border-background/20 border-t-background rounded-full animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  Save to Inventory
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* --- THE SIDEBAR DRAWER --- */}
      <SpecsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        specs={techSpecs}
        setSpecs={setTechSpecs}
      />
    </>
  );
}
