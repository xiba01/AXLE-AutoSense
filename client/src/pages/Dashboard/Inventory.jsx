import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDisclosure } from "@heroui/react";
import { Plus, Package } from "lucide-react";

// Components
import InventoryTable from "../../components/dashboard/inventory/InventoryTable";
import AddCarModal from "../../components/dashboard/inventory/AddCarModal";

// Actions
import { fetchInventory } from "../../store/slices/inventorySlice";

export default function Inventory() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingCar, setEditingCar] = useState(null);

  const {
    list: cars,
    loading,
    error,
  } = useSelector((state) => state.inventory);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const handleCreate = () => {
    setEditingCar(null);
    onOpen();
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    onOpen();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-foreground/5 flex items-center justify-center">
            <Package className="size-6 text-foreground/60" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Inventory
            </h1>
            <p className="text-sm text-foreground/50">
              Manage your fleet and generate stories
            </p>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-background text-sm font-medium rounded-xl hover:bg-foreground/90 active:scale-[0.98] transition-all"
        >
          <Plus className="size-4" />
          Add Vehicle
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl">
          <div className="size-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm">Error loading inventory: {error}</span>
        </div>
      )}

      {/* Table */}
      <InventoryTable cars={cars} loading={loading} onEdit={handleEdit} />

      {/* Modal */}
      <AddCarModal isOpen={isOpen} onClose={onClose} initialData={editingCar} />
    </div>
  );
}
