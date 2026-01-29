import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchStudioData } from "../../../store/slices/studioSlice";
import { Button, Spinner, Chip } from "@heroui/react";
import { Sparkles, Grid } from "lucide-react";
import StudioCard from "../../../components/dashboard/studio/StudioCard";

export default function StudioPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.studio);

  useEffect(() => {
    dispatch(fetchStudioData());
  }, [dispatch]);

  // Filter Logic
  const displayedItems = useMemo(() => {
    const path = location.pathname;
    if (path.endsWith("/published")) {
      return items.filter((car) => car.hasStory);
    }
    if (path.endsWith("/trash")) {
      return items.filter((car) => car.status === "archived");
    }
    return items;
  }, [location.pathname, items]);

  const getPageTitle = () => {
    if (location.pathname.endsWith("/published")) return "Published Stories";
    if (location.pathname.endsWith("/trash")) return "Trash";
    return "All Stories";
  };

  // --- HANDLERS (THE FIX) ---

  const handleGenerate = (car) => {
    navigate("/dashboard/studio/wizard", { state: { car } });
  };

  const handlePlay = (car) => {
    if (car.story?.id) {
      const url = `/experience/${car.story.id}`;
      window.open(url, "_blank");
    } else {
      alert("Error: Story ID missing");
    }
  };

  const handleEdit = (car) => {
    if (car.story?.id) {
      navigate(`/dashboard/editor/${car.story.id}`);
    } else {
      alert("Error: Story ID missing");
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end border-b border-default-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            {getPageTitle()}
            <Chip size="sm" variant="flat">
              {displayedItems.length}
            </Chip>
          </h1>
          <p className="text-default-500 mt-1">
            Manage your AutoSense inventory content.
          </p>
        </div>

        {location.pathname === "/dashboard/studio" && (
          <Button
            color="primary"
            className="font-bold shadow-lg shadow-primary/20"
            startContent={<Sparkles size={18} />}
            onPress={() => navigate("/dashboard/studio/wizard")}
          >
            Create New Story
          </Button>
        )}
      </div>

      {/* GRID */}
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

            {displayedItems.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-default-400 border-2 border-dashed border-default-200 rounded-2xl bg-default-50">
                <div className="p-4 bg-default-100 rounded-full mb-4">
                  <Grid size={32} className="opacity-50" />
                </div>
                <p className="font-semibold text-lg">No items found</p>
                <p className="text-sm">There are no vehicles in this view.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
