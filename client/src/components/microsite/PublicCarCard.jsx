import React from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardBody, Image } from "@heroui/react";
import { Fuel, Gauge, Box, ArrowRight } from "lucide-react";

export default function PublicCarCard({ car }) {
  const { dealerId } = useParams();

  // Data Safety
  const image =
    car.photos?.[0] ||
    "https://placehold.co/600x400/f3f4f6/9ca3af?text=No+Image";
  const title = `${car.year} ${car.make} ${car.model}`;
  const subtitle = car.trim || "Base Trim";
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: car.currency || "USD",
    maximumFractionDigits: 0,
  }).format(car.price);

  // 3D Status
  const has3D = car.hasStory;
  const isNew = car.specs_raw?.condition?.toLowerCase() === "new";

  return (
    <Link to={`/sites/${dealerId}/inventory/${car.id}`} className="block">
      <Card
        className="w-full group hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl bg-white overflow-hidden rounded-xl border border-transparent hover:border-gray-200"
        isPressable
      >
        {/* IMAGE HEADER */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            removeWrapper
            src={image}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt={title}
          />

          {/* Top Badge */}
          {has3D && (
            <div className="absolute top-3 right-3 z-10">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-sm text-white text-xs font-medium shadow-lg">
                <Box size={12} />
                <span>AutoSense</span>
              </div>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        {/* CONTENT BODY */}
        <CardBody className="p-4 space-y-3">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-500 truncate">{subtitle}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <p className="text-lg font-bold text-gray-900">{price}</p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={18} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Key Specs */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <Gauge size={14} className="text-gray-400" />
              {car.mileage?.toLocaleString() || "0"} mi
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5">
              <Fuel size={14} className="text-gray-400" />
              {car.specs_raw?.fuelType || "Gas"}
            </span>
            {isNew && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-emerald-600 font-medium">New</span>
              </>
            )}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
