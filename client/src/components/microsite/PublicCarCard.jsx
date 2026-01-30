import React from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardBody, Image, Chip } from "@heroui/react";
import {
  Fuel,
  Gauge,
  Calendar,
  ArrowRight,
  Box,
  MapPin,
  CheckCircle2,
} from "lucide-react";

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
        className="w-full group hover:-translate-y-1 transition-all duration-300 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 bg-white overflow-hidden rounded-2xl"
        isPressable
      >
        {/* IMAGE HEADER */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            removeWrapper
            src={image}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt={title}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top Badges Row */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
            {/* Condition Badge */}
            <div
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider shadow-lg backdrop-blur-sm ${
                isNew
                  ? "bg-emerald-500 text-white"
                  : "bg-white/95 text-gray-800"
              }`}
            >
              {car.specs_raw?.condition || "Pre-Owned"}
            </div>

            {/* AutoSense Badge */}
            {has3D && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white backdrop-blur-sm text-[10px] font-semibold tracking-wide shadow-lg">
                <Box size={11} />
                <span>AutoSense</span>
              </div>
            )}
          </div>

          {/* Price Tag - Bottom Left */}
          <div className="absolute bottom-3 left-3 z-10">
            <div className="bg-white/98 backdrop-blur-md rounded-xl px-3.5 py-2 shadow-lg border border-white/20">
              <p className="text-lg font-bold text-gray-900">{price}</p>
            </div>
          </div>

          {/* Quick View Arrow */}
          <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-3 group-hover:translate-x-0">
            <div className="size-10 bg-white/98 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/20">
              <ArrowRight size={18} className="text-gray-900" />
            </div>
          </div>
        </div>

        {/* CONTENT BODY */}
        <CardBody className="p-5 space-y-3.5">
          {/* Title & Trim */}
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
              {subtitle}
            </p>
          </div>

          {/* Key Specs - Inline Pills */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
              <Gauge size={13} className="text-gray-400" />
              {car.mileage?.toLocaleString() || "0"} mi
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
              <Fuel size={13} className="text-gray-400" />
              {car.specs_raw?.fuelType || "Gasoline"}
            </span>
            {car.specs_raw?.transmission && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                {car.specs_raw.transmission}
              </span>
            )}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
