import React from "react";
import { useDispatch } from "react-redux";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@heroui/react";
import { Edit3, Trash2, Eye, Plus, Car } from "lucide-react";
import { deleteCar } from "../../../store/slices/inventorySlice";

const statusStyles = {
  published: "bg-emerald-500/10 text-emerald-600",
  draft: "bg-foreground/5 text-foreground/60",
  sold: "bg-amber-500/10 text-amber-600",
};

export default function InventoryTable({ cars, loading, onEdit }) {
  const dispatch = useDispatch();

  const columns = [
    { name: "Vehicle", uid: "vehicle" },
    { name: "Trim", uid: "trim" },
    { name: "Price", uid: "price" },
    { name: "", uid: "actions" },
  ];

  const renderCell = React.useCallback(
    (car, columnKey) => {
      const cellValue = car[columnKey];

      switch (columnKey) {
        case "vehicle":
          const avatarSrc =
            car.photos && car.photos.length > 0 ? car.photos[0] : null;

          return (
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-foreground/5 overflow-hidden flex items-center justify-center flex-shrink-0">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Car className="size-5 text-foreground/30" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">
                  {car.year} {car.make} {car.model}
                </p>
                <p className="text-xs text-foreground/40 font-mono truncate">
                  {car.vin}
                </p>
              </div>
            </div>
          );

        case "trim":
          return (
            <div>
              <p className="text-sm text-foreground">{car.trim || "Base"}</p>
              <p className="text-xs text-foreground/40">
                {Object.keys(car.specs_raw || {}).length} specs
              </p>
            </div>
          );

        case "price":
          return (
            <div>
              <p className="text-sm font-medium text-foreground tabular-nums">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: car.currency || "USD",
                  maximumFractionDigits: 0,
                }).format(car.price)}
              </p>
              <p className="text-xs text-foreground/40 tabular-nums">
                {car.mileage?.toLocaleString() || 0} mi
              </p>
            </div>
          );



        case "actions":
          return (
            <div className="flex items-center justify-end gap-1">
              <Tooltip content="View Story" delay={0} closeDelay={0}>
                <button className="p-2 rounded-lg text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors">
                  <Eye className="size-4" />
                </button>
              </Tooltip>

              <Tooltip content="Edit" delay={0} closeDelay={0}>
                <button
                  onClick={() => onEdit(car)}
                  className="p-2 rounded-lg text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
                >
                  <Edit3 className="size-4" />
                </button>
              </Tooltip>

              <Tooltip content="Delete" delay={0} closeDelay={0}>
                <button
                  onClick={() => {
                    if (
                      window.confirm("Are you sure? This cannot be undone.")
                    ) {
                      dispatch(deleteCar(car.id));
                    }
                  }}
                  className="p-2 rounded-lg text-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [dispatch, onEdit],
  );

  // Empty State
  if (!loading && cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-foreground/10 rounded-2xl">
        <div className="size-14 rounded-2xl bg-foreground/5 flex items-center justify-center mb-4">
          <Plus className="size-6 text-foreground/30" />
        </div>
        <h3 className="text-base font-medium text-foreground">
          No vehicles yet
        </h3>
        <p className="text-sm text-foreground/50 max-w-xs mt-1">
          Add your first vehicle to generate an AutoSense story
        </p>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 border-2 border-foreground/10 border-t-foreground/60 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Table
      aria-label="Inventory Table"
      selectionMode="none"
      classNames={{
        wrapper:
          "bg-background shadow-none border border-foreground/[0.08] rounded-2xl",
        th: "bg-foreground/[0.02] text-foreground/50 text-xs font-medium border-b border-foreground/[0.06]",
        td: "py-4",
        tr: "border-b border-foreground/[0.04] last:border-0 hover:bg-foreground/[0.02] transition-colors",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "end" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={cars}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
