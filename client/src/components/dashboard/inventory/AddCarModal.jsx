import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Divider,
  Image,
  Chip,
  Tooltip,
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
} from "lucide-react";

// Imports from previous steps
import { fetchTrimSpecs } from "../../../services/carSpecsService";
import { addCar, updateCar } from "../../../store/slices/inventorySlice";
import { v4 as uuidv4 } from "uuid";
import SpecsDrawer from "./SpecsDrawer"; // The component we built in Part 3

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

  // D. Visuals
  const [photoFiles, setPhotoFiles] = useState([]); // File Objects (for upload)
  const [photoPreviews, setPhotoPreviews] = useState([]); // Blob URLs (for UI)
  const [existingPhotos, setExistingPhotos] = useState([]); // Existing URLs from DB
  const fileInputRef = useRef(null);

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
          }),
        ).unwrap();
      } else {
        await dispatch(
          addCar({
            formData: mainInfo,
            specsList: techSpecs,
            photos: photoFiles,
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
              <ModalHeader className="flex flex-col gap-1">
                {initialData ? "Edit Vehicle" : "Add New Vehicle"}
                <span className="text-tiny text-default-400 font-normal">
                  {initialData
                    ? `Updating ID: ${initialData.vin}`
                    : "Import data from RapidAPI or enter manually."}
                </span>
              </ModalHeader>

              <ModalBody className="gap-8 pb-8">
                {/* --- SECTION A: PHOTOS --- */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-default-500 flex items-center gap-2">
                      <Layers size={16} /> Visuals
                    </h3>
                    <span className="text-tiny text-default-400">
                      {photoPreviews.length} photos selected
                    </span>
                  </div>

                  {/* Upload Area */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Add Button */}
                    <div
                      onClick={() => fileInputRef.current.click()}
                      className="aspect-[4/3] rounded-xl border-2 border-dashed border-default-300 hover:border-primary hover:bg-primary/5 cursor-pointer flex flex-col items-center justify-center transition-all group"
                    >
                      <UploadCloud className="text-default-400 group-hover:text-primary mb-2" />
                      <span className="text-xs text-default-500 font-medium group-hover:text-primary">
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
                        className="relative aspect-[4/3] group rounded-xl overflow-hidden shadow-sm border border-default-200"
                      >
                        <Image
                          src={src}
                          alt="preview"
                          classNames={{
                            wrapper: "w-full h-full",
                            img: "w-full h-full object-cover",
                          }}
                        />
                        <button
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1 right-1 bg-black/50 hover:bg-danger text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <Divider />

                {/* --- SECTION B: IDENTIFICATION (API FETCH) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: The "Hook" */}
                  <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-default-500 flex items-center gap-2">
                      <Sparkles size={16} /> Data Import
                    </h3>

                    <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl space-y-4 border border-primary-100 dark:border-primary-800">
                      <Input
                        label="RapidAPI Trim ID"
                        placeholder="e.g. 128478"
                        value={trimId}
                        onChange={(e) => setTrimId(e.target.value)}
                        variant="bordered"
                        description="Find this ID in the Car Specs API database."
                        endContent={
                          <Button
                            size="sm"
                            color="primary"
                            isLoading={isFetching}
                            isIconOnly={!trimId} // Icon only on mobile/small space
                            onPress={handleFetch}
                          >
                            {isFetching ? "" : <Search size={16} />}
                          </Button>
                        }
                      />

                      {techSpecs.length > 0 && (
                        <div className="flex items-center gap-2 text-success-600 bg-white dark:bg-black/20 p-2 rounded-lg text-xs font-medium border border-success-200">
                          <CheckCircleIcon />
                          <span>
                            Successfully loaded {techSpecs.length} specs
                          </span>
                        </div>
                      )}

                      <Button
                        fullWidth
                        variant="flat"
                        color={techSpecs.length > 0 ? "secondary" : "default"}
                        isDisabled={techSpecs.length === 0}
                        onPress={() => setIsDrawerOpen(true)}
                        startContent={<Cpu size={18} />}
                      >
                        {techSpecs.length > 0
                          ? "Review & Edit Specs"
                          : "Waiting for Data..."}
                      </Button>
                    </div>
                  </div>

                  {/* Right Column: The Form */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-default-500 flex items-center gap-2">
                      <Info size={16} /> Commercial Details
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="VIN"
                        placeholder="17 chars"
                        value={mainInfo.vin}
                        onChange={(e) =>
                          handleInputChange("vin", e.target.value)
                        }
                        isRequired
                      />
                      <Input
                        label="Make"
                        value={mainInfo.make}
                        onChange={(e) =>
                          handleInputChange("make", e.target.value)
                        }
                        isRequired
                      />
                      <Input
                        label="Model"
                        value={mainInfo.model}
                        onChange={(e) =>
                          handleInputChange("model", e.target.value)
                        }
                        isRequired
                      />
                      <Input
                        label="Year"
                        type="number"
                        value={mainInfo.year}
                        onChange={(e) =>
                          handleInputChange("year", e.target.value)
                        }
                        isRequired
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Trim / Series"
                        value={mainInfo.trim}
                        onChange={(e) =>
                          handleInputChange("trim", e.target.value)
                        }
                        description="e.g. M Sport, AMG Line"
                      />
                      <Input
                        label="Color"
                        placeholder="e.g. Alpine White"
                        value={mainInfo.color}
                        onChange={(e) =>
                          handleInputChange("color", e.target.value)
                        }
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        label="Price"
                        type="number"
                        startContent={
                          <span className="text-default-400">$</span>
                        }
                        value={mainInfo.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                      />
                      <Input
                        label="Mileage"
                        type="number"
                        endContent={
                          <span className="text-default-400 text-tiny">mi</span>
                        }
                        value={mainInfo.mileage}
                        onChange={(e) =>
                          handleInputChange("mileage", e.target.value)
                        }
                      />
                      <Select
                        label="Condition"
                        defaultSelectedKeys={[mainInfo.condition]}
                        onChange={(e) =>
                          handleInputChange("condition", e.target.value)
                        }
                      >
                        <SelectItem key="New">New</SelectItem>
                        <SelectItem key="Used">Used</SelectItem>
                        <SelectItem key="CPO">CPO</SelectItem>
                      </Select>
                    </div>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSave}
                  isLoading={isSaving}
                  startContent={!isSaving && <Save size={18} />}
                >
                  Save to Inventory
                </Button>
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

// Simple Icon helper
const CheckCircleIcon = () => (
  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);
