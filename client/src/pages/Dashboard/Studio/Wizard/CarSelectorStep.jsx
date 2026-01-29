import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Search } from "lucide-react";

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
    <div className="flex flex-col h-full space-y-8">
      {/* 1. HERO SEARCH */}
      <div className="text-center space-y-5 max-w-xl mx-auto w-full">
        <h2 className="text-3xl font-semibold text-white tracking-tight">
          Select a Vehicle
        </h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search make, model, or year"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-11 pr-4 bg-white/[0.08] text-white text-sm placeholder:text-white/40 rounded-xl border border-white/[0.08] focus:outline-none focus:bg-white/[0.12] focus:border-white/20 transition-all"
          />
        </div>
      </div>

      {/* 2. THE GRID */}
      <div className="flex-1 overflow-y-auto pr-2 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedItems.map((car) => (
            <button
              key={car.id}
              onClick={() => onSelect(car)}
              className={`
                group relative h-28 rounded-2xl overflow-hidden flex text-left transition-all
                ${
                  car.hasStory
                    ? "bg-white/[0.04] hover:bg-white/[0.08] opacity-50 hover:opacity-80"
                    : "bg-white/[0.06] hover:bg-white/[0.12]"
                }
              `}
            >
              {/* Left: Image */}
              <div className="w-2/5 h-full relative overflow-hidden">
                <img
                  src={
                    car.photos?.[0] || "https://placehold.co/400?text=No+Img"
                  }
                  alt={car.model}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                />
              </div>

              {/* Right: Info */}
              <div className="flex-1 px-4 py-3 flex flex-col justify-center">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                      {car.year} {car.make}
                    </p>
                    <h3 className="text-base font-semibold text-white mt-0.5 tracking-tight truncate">
                      {car.model}
                    </h3>
                    <p className="text-xs text-white/50 truncate mt-0.5">
                      {car.trim}
                    </p>
                  </div>

                  {/* Status Badge */}
                  {car.hasStory ? (
                    <span className="shrink-0 px-2 py-0.5 text-[10px] font-medium bg-yellow-500/20 text-yellow-300 rounded-md">
                      Remix
                    </span>
                  ) : (
                    <div className="shrink-0 w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
