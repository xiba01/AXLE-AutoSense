import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux"; // <--- Redux Hooks
import { fetchStudioData } from "../../../store/slices/studioSlice"; // <--- The Thunk
import { Tabs, Tab, Button, Chip, Spinner } from "@heroui/react";
import { Sparkles, Film, Grid, ListFilter } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import StudioCard from "../../../components/dashboard/studio/StudioCard";

export default function StudioPage() {
  const dispatch = useDispatch();
  const { items, stats, loading } = useSelector((state) => state.studio);
  const location = useLocation();
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState("all");

  // 1. Fetch Data on Mount
  useEffect(() => {
    dispatch(fetchStudioData());
  }, [dispatch]);

  const handleGenerate = (car) => {
    navigate("/dashboard/studio/wizard", { state: { car } });
  };

  const handlePlay = (car) => {
    console.log("▶️ Play Story:", car.story.id);
  };

  const handleEdit = (car) => {
    console.log("✏️ Edit Story:", car.story.id);
  };

  // 2. Filter Logic (Memoized for performance)
  const displayedItems = useMemo(() => {
    const path = location.pathname;

    if (path.endsWith("/published")) {
      return items.filter(
        (car) => car.hasStory && car.storyStatus === "published",
      );
    }

    if (path.endsWith("/trash")) {
      return items.filter((car) => car.status === "archived");
    }

    switch (activeTab) {
      case "unexplored":
        return items.filter((car) => !car.hasStory);
      case "showroom":
        return items.filter((car) => car.hasStory);
      default:
        return items;
    }
  }, [activeTab, items, location.pathname]);

  // 3. Dynamic Title based on Route
  const getPageTitle = () => {
    if (location.pathname.endsWith("/published")) return "Published Stories";
    if (location.pathname.endsWith("/trash")) return "Trash";
    return "All Stories";
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* HEADER (Same as before) */}
      <div className="relative rounded-2xl overflow-hidden bg-black text-white p-8 shadow-large">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-violet-900/50 to-blue-900/50 z-0 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="size-5 text-warning animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-warning">
                AI Creative Suite
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              AutoSense Studio
            </h1>
            <p className="text-default-300 max-w-lg mt-1">
              Transform your inventory into cinematic experiences.
            </p>
          </div>

          {location.pathname === "/dashboard/studio" && (
            <Button
              size="lg"
              className="bg-white text-black font-bold shadow-xl"
              startContent={<Sparkles className="size-5" />}
              onPress={() => navigate("/dashboard/studio/wizard")}
            >
              Create New Story
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-widest text-default-400">
          {getPageTitle()}
        </span>
        <Chip size="sm" variant="flat">
          {displayedItems.length}
        </Chip>
      </div>

      {/* TABS (Updated with Real Stats) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Tabs
          aria-label="Studio Filters"
          color="primary"
          variant="underlined"
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-primary font-medium",
          }}
        >
          <Tab
            key="all"
            title={
              <div className="flex items-center space-x-2">
                <Grid size={18} />
                <span>All Vehicles</span>
                <Chip size="sm" variant="flat">
                  {stats.total}
                </Chip>
              </div>
            }
          />
          <Tab
            key="unexplored"
            title={
              <div className="flex items-center space-x-2">
                <Sparkles size={18} />
                <span>Unexplored</span>
                <Chip size="sm" variant="flat" color="warning">
                  {stats.unexplored}
                </Chip>
              </div>
            }
          />
          <Tab
            key="showroom"
            title={
              <div className="flex items-center space-x-2">
                <Film size={18} />
                <span>Showroom</span>
                <Chip size="sm" variant="flat" color="success">
                  {stats.showroom}
                </Chip>
              </div>
            }
          />
        </Tabs>
      </div>

      {/* 3. CONTENT AREA (Grid) */}
      <div className="flex-1 min-h-[400px] pb-10">
        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Spinner size="lg" color="primary" label="Scanning Inventory..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedItems.map((car) => (
              <StudioCard
                key={car.id}
                car={car}
                onGenerate={handleGenerate}
                onPlay={handlePlay}
                onEdit={handleEdit}
              />
            ))}

            {/* Empty State */}
            {displayedItems.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-default-400 border-2 border-dashed border-default-200 rounded-2xl bg-default-50">
                <div className="p-4 bg-default-100 rounded-full mb-4">
                  <Grid size={32} className="opacity-50" />
                </div>
                <p className="font-semibold text-lg">No vehicles found</p>
                <p className="text-sm">Try changing the tab filter.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
