import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, useDisclosure } from "@heroui/react";
import { Plus } from "lucide-react";

// Components
import InventoryTable from "../../components/dashboard/inventory/InventoryTable";
import AddCarModal from "../../components/dashboard/inventory/AddCarModal";

// Actions
import { fetchInventory } from "../../store/slices/inventorySlice";

export default function Inventory() {
  const dispatch = useDispatch();
  // HeroUI hook for modal management
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State for Edit Mode
  const [editingCar, setEditingCar] = useState(null);

  // Get State from Redux
  const {
    list: cars,
    loading,
    error,
  } = useSelector((state) => state.inventory);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  // HANDLERS
  const handleCreate = () => {
    setEditingCar(null); // Clear data for new car
    onOpen();
  };

  const handleEdit = (car) => {
    setEditingCar(car); // Load car data
    onOpen(); // Open modal
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
          <p className="text-default-500">
            Manage your fleet and generate stories.
          </p>
        </div>

        <Button
          color="primary"
          endContent={<Plus size={18} />}
          onPress={handleCreate} // Triggers Create Mode
          className="font-semibold shadow-md"
        >
          Add Vehicle
        </Button>
      </div>

      {/* 2. THE TABLE */}
      {error && (
        <div className="p-4 bg-danger-50 text-danger border border-danger-200 rounded-lg">
          Error loading inventory: {error}
        </div>
      )}

      <InventoryTable
        cars={cars}
        loading={loading}
        onEdit={handleEdit} // Triggers Edit Mode
      />

      {/* 3. THE MODAL */}
      <AddCarModal
        isOpen={isOpen}
        onClose={onClose}
        initialData={editingCar} // Pass the data to the form
      />
    </div>
  );
}
