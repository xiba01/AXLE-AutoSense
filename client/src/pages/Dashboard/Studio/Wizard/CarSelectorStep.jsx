import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Input, Card, CardBody, Chip, Image, Button } from "@heroui/react";
import { Search, Sparkles, AlertCircle } from "lucide-react";

export default function CarSelectorStep({ onSelect }) {
  const { items } = useSelector((state) => state.studio);
  const [search, setSearch] = useState("");

  // Filter Logic
  const filteredItems = items.filter(
    (car) =>
      car.make.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase()) ||
      car.year.toString().includes(search),
  );

  // Sort: Unexplored first
  const sortedItems = [...filteredItems].sort((a, b) => {
    return a.hasStory === b.hasStory ? 0 : a.hasStory ? 1 : -1;
  });

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* 1. HERO SEARCH */}
      <div className="text-center space-y-4 max-w-2xl mx-auto w-full">
        <h2 className="text-4xl font-bold text-white">Choose a Vehicle</h2>
        <Input
          size="lg"
          placeholder="Search by Make, Model, or Year..."
          startContent={<Search className="text-neutral-400" />}
          classNames={{
            inputWrapper:
              "bg-white/10 border border-white/20 hover:bg-white/20 focus-within:bg-white/20 h-14",
            input: "text-white placeholder:text-neutral-500 text-lg",
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 2. THE GRID */}
      <div className="flex-1 overflow-y-auto pr-2 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((car) => (
            <div
              key={car.id}
              onClick={() => onSelect(car)}
              className={`
                group relative h-32 rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden flex
                ${
                  car.hasStory
                    ? "bg-neutral-900/50 border-neutral-800 hover:border-neutral-600 opacity-60 hover:opacity-100"
                    : "bg-white/5 border-primary/50 hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_30px_rgba(0,136,255,0.2)]"
                }
              `}
            >
              {/* Left: Image */}
              <div className="w-1/3 h-full relative">
                <Image
                  removeWrapper
                  src={
                    car.photos?.[0] || "https://placehold.co/400?text=No+Img"
                  }
                  className="w-full h-full object-cover rounded-none"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/80" />
              </div>

              {/* Right: Info */}
              <div className="flex-1 p-4 flex flex-col justify-center">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase">
                      {car.year} {car.make}
                    </p>
                    <h3 className="text-lg font-bold text-white">
                      {car.model}
                    </h3>
                    <p className="text-xs text-neutral-500 truncate max-w-[150px]">
                      {car.trim}
                    </p>
                  </div>

                  {/* Status Badge */}
                  {car.hasStory ? (
                    <Chip
                      size="sm"
                      variant="flat"
                      color="warning"
                      className="text-[10px]"
                    >
                      RewritE
                    </Chip>
                  ) : (
                    <div className="bg-primary/20 p-1.5 rounded-full animate-pulse">
                      <Sparkles className="size-4 text-primary" />
                    </div>
                  )}
                </div>
              </div>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 h-1 bg-primary w-0 group-hover:w-full transition-all duration-500 ease-out" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
