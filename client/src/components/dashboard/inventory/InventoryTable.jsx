import React from "react";
import { useDispatch } from "react-redux";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Button,
} from "@heroui/react";
import { Edit3, Trash2, Eye, Plus } from "lucide-react";
import { deleteCar } from "../../../store/slices/inventorySlice";

const statusColorMap = {
  published: "success",
  draft: "default",
  sold: "warning",
};

export default function InventoryTable({ cars, loading, onEdit }) {
  const dispatch = useDispatch();

  const columns = [
    { name: "VEHICLE", uid: "vehicle" },
    { name: "TRIM / SPECS", uid: "trim" },
    { name: "PRICE", uid: "price" },
    { name: "STATUS", uid: "status" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const renderCell = React.useCallback(
    (car, columnKey) => {
      const cellValue = car[columnKey];

      switch (columnKey) {
        case "vehicle":
          const avatarSrc =
            car.photos && car.photos.length > 0
              ? car.photos[0]
              : "https://placehold.co/100x100?text=No+Img";

          return (
            <User
              avatarProps={{
                radius: "sm", // Squared look works better for cars
                src: avatarSrc,
                size: "lg",
                isBordered: true,
              }}
              description={
                <span className="text-tiny text-default-400 font-mono">
                  {car.vin}
                </span>
              }
              name={
                <span className="font-semibold text-foreground">
                  {car.year} {car.make} {car.model}
                </span>
              }
            >
              {car.vin}
            </User>
          );

        case "trim":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {car.trim || "Base Trim"}
              </p>
              <p className="text-tiny text-default-400 capitalize">
                {Object.keys(car.specs_raw || {}).length} Technical Specs
              </p>
            </div>
          );

        case "price":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: car.currency || "USD",
                  maximumFractionDigits: 0,
                }).format(car.price)}
              </p>
              <p className="text-tiny text-default-400">
                {car.mileage.toLocaleString()} mi
              </p>
            </div>
          );

        case "status":
          return (
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              color={statusColorMap[car.status]}
              size="sm"
              variant="flat" // Clean, modern look
            >
              {car.status}
            </Chip>
          );

        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip
                content="View Story"
                color="foreground"
                delay={0}
                closeDelay={0}
              >
                <Button isIconOnly size="sm" variant="light" color="default">
                  <Eye className="text-default-500" size={18} />
                </Button>
              </Tooltip>

              <Tooltip
                content="Edit Car"
                color="foreground"
                delay={0}
                closeDelay={0}
              >
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => onEdit(car)}
                >
                  <Edit3 className="text-default-500" size={18} />
                </Button>
              </Tooltip>

              <Tooltip content="Delete" color="danger" delay={0} closeDelay={0}>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() => {
                    if (
                      window.confirm("Are you sure? This cannot be undone.")
                    ) {
                      dispatch(deleteCar(car.id));
                    }
                  }}
                >
                  <Trash2 size={18} />
                </Button>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [dispatch, onEdit],
  );

  // Cleaner Empty State using HeroUI styling patterns
  if (!loading && cars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-content1 border border-dashed border-default-200 rounded-medium">
        <div className="bg-default-100 p-4 rounded-full mb-4">
          <Plus className="text-default-500 size-8" />
        </div>
        <h3 className="text-lg font-medium text-foreground">
          No vehicles found
        </h3>
        <p className="text-sm text-default-500 max-w-xs mt-1 mb-6">
          Your inventory is empty. Add your first vehicle to generate an
          AutoSense story.
        </p>
      </div>
    );
  }

  return (
    <Table
      aria-label="Inventory Table"
      selectionMode="none"
      classNames={{
        wrapper: "h-auto min-h-0 shadow-sm border border-default-200", // Changed from min-h-[400px] to h-auto
        th: "bg-default-50 text-default-500 font-medium",
        td: "py-3",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={
              column.uid === "actions" || column.uid === "status"
                ? "center"
                : "start"
            }
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={cars} isLoading={loading}>
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
