import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  Sparkles,
  Play,
  MoreHorizontal,
  Edit3,
  Trash2,
  Share2,
  RefreshCcw,
} from "lucide-react";

// NEW PROP: variant ('auto' | 'showroom' | 'trash' | 'unexplored')
export default function StudioCard({
  car,
  onGenerate,
  onPlay,
  onEdit,
  onDelete,
  onRestore,
  variant = "auto",
}) {
  const hasStory = car.hasStoryHistory;
  const isDeleted = car.isDeleted;
  const thumbnail =
    car.photos?.[0] || "https://placehold.co/600x400/1a1a1a/FFF?text=No+Image";

  // LOGIC: Determine which view to render
  let renderMode = "unexplored";

  if (variant !== "auto") {
    // Parent forces the mode
    renderMode = variant;
  } else {
    // Auto-detect based on data
    if (hasStory) renderMode = "showroom";
    if (isDeleted) renderMode = "trash"; // Trash overrides showroom if auto
  }

  // -----------------------------------------------------------
  // RENDER A: SHOWROOM / TRASH STYLE (The Media Card)
  // -----------------------------------------------------------
  if (renderMode === "showroom" || renderMode === "trash") {
    const isTrash = renderMode === "trash";

    return (
      <div
        className={`relative h-[280px] rounded-2xl overflow-hidden group ${
          isTrash ? "opacity-50 grayscale" : ""
        }`}
      >
        {/* Image */}
        <img
          alt={car.model}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={thumbnail}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Bar */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <span
            className={`px-2 py-1 text-[10px] font-medium rounded-md backdrop-blur-sm ${
              isTrash
                ? "bg-red-500/80 text-white"
                : car.storyStatus === "published"
                  ? "bg-green-500/40 text-white"
                  : "bg-yellow-500/40 text-white"
            }`}
          >
            {isTrash ? "Deleted" : car.storyStatus || "Draft"}
          </span>

          <Dropdown>
            <DropdownTrigger>
              <button className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-colors">
                <MoreHorizontal size={14} />
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Story Actions" className="min-w-[140px]">
              {!isTrash && (
                <DropdownItem
                  key="edit"
                  startContent={<Edit3 size={14} />}
                  onPress={() => onEdit(car)}
                >
                  Edit
                </DropdownItem>
              )}
              {!isTrash && (
                <DropdownItem key="share" startContent={<Share2 size={14} />}>
                  Share
                </DropdownItem>
              )}
              {isTrash ? (
                <DropdownItem
                  key="restore"
                  color="success"
                  className="text-success"
                  startContent={<RefreshCcw size={14} />}
                  onPress={() => onRestore(car)}
                >
                  Restore
                </DropdownItem>
              ) : (
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<Trash2 size={14} />}
                  onPress={() => onDelete(car)}
                >
                  Delete
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Play Button (Hover) */}
        {!isTrash && (
          <button
            onClick={() => onPlay(car)}
            className="absolute inset-0 z-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform">
              <Play fill="white" className="text-white ml-1" size={22} />
            </div>
          </button>
        )}

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[11px] text-white/60 font-medium">
                {car.year} {car.make}
              </p>
              <h4 className="text-white font-semibold text-base tracking-tight truncate max-w-[180px]">
                {car.model} {car.trim}
              </h4>
            </div>
            {!isTrash && (
              <button
                onClick={() => onEdit(car)}
                className="px-3 py-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors"
              >
                Studio
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // RENDER B: UNEXPLORED STYLE (The "Create New" Card)
  // -----------------------------------------------------------
  return (
    <div className="h-[280px] rounded-2xl overflow-hidden border border-default-200 bg-background hover:border-default-300 transition-all group">
      {/* Image Section */}
      <div className="h-[150px] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
        <img
          alt={car.model}
          className="w-full h-full object-cover opacity-70 grayscale group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-500"
          src={thumbnail}
        />
        <div className="absolute bottom-3 left-4 z-20">
          <p className="text-[11px] font-medium text-default-500">
            {car.year} {car.make}
          </p>
          <p className="font-semibold text-foreground text-base tracking-tight">
            {car.model}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between h-[130px]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            <span className="text-[11px] font-medium text-default-500">
              Ready to create
            </span>
          </div>
          <p className="text-sm text-default-400 line-clamp-2">
            Generate an AI story for this vehicle
          </p>
        </div>

        <button
          onClick={() => onGenerate(car)}
          className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-medium py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
        >
          <Sparkles size={15} />
          Generate AutoSense
        </button>
      </div>
    </div>
  );
}
