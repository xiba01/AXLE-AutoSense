import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchStudioData,
  softDeleteStory,
  restoreStory,
} from "../../../store/slices/studioSlice";
import { Button, Spinner, Chip, Divider } from "@heroui/react";
import { Sparkles, Grid, Film } from "lucide-react";
import StudioCard from "../../../components/dashboard/studio/StudioCard";

export default function StudioPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.studio);

  useEffect(() => {
    dispatch(fetchStudioData());
  }, [dispatch]);

  // 1. Determine Current View Mode
  const isMainView = location.pathname === "/dashboard/studio";
  const isTrashView = location.pathname.endsWith("/trash");
  const isPublishedView = location.pathname.endsWith("/published");

  // 2. Data Slicing
  // FIX: Unexplored now includes cars with NO story OR DELETED stories.
  // Basically: "Is it not in the showroom? Then it's ready to create."
  const unexploredCars = useMemo(
    () => items.filter((c) => !c.hasActiveStory && c.status !== "archived"),
    [items],
  );

  // Showroom: Only cars with an ACTIVE story (not deleted).
  const showroomCars = useMemo(
    () => items.filter((c) => c.hasActiveStory),
    [items],
  );

  // Trash: Cars with DELETED stories.
  const trashCars = useMemo(() => items.filter((c) => c.isDeleted), [items]);

  // 3. Determine what to show based on Route
  const getPageTitle = () => {
    if (isPublishedView) return "Published Stories";
    if (isTrashView) return "Trash";
    return "All Vehicles";
  };

  const getCount = () => {
    if (isPublishedView) return showroomCars.length;
    if (isTrashView) return trashCars.length;
    return items.length; // All
  };

  // --- HANDLERS ---
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

  const handleDelete = (car) => {
    if (confirm("Move this story to trash?")) {
      dispatch(softDeleteStory(car.story.id));
    }
  };

  // --- HANDLER: RESTORE WITH CONFLICT CHECK ---
  const handleRestore = (car) => {
    const conflict = showroomCars.find((c) => c.id === car.id);

    if (conflict) {
      const userConfirmed = window.confirm(
        "⚠️ Conflict Detected\n\nThis car already has an active story.\n\nDo you want to MOVE the current story to Trash and RESTORE this one?",
      );

      if (userConfirmed) {
        dispatch(softDeleteStory(conflict.story.id)).then(() => {
          dispatch(restoreStory(car.story.id));
        });
      }
    } else {
      dispatch(restoreStory(car.story.id));
    }
  };

  // Helper: Reusable Grid Render
  const CarGrid = ({ data, emptyMessage, forceVariant }) => {
    if (data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-default-400 border-2 border-dashed border-default-200 rounded-2xl bg-default-50/50">
          <div className="p-3 bg-default-100 rounded-full mb-3">
            <Grid size={24} className="opacity-50" />
          </div>
          <p className="text-sm">{emptyMessage}</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((car) => (
          <StudioCard
            key={car.id}
            car={car}
            variant={forceVariant || "auto"}
            onGenerate={handleGenerate}
            onPlay={handlePlay}
            onEdit={handleEdit}
            onDelete={handleDelete} // Wired up
            onRestore={handleRestore} // Wired up
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-default-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            {getPageTitle()}
            <Chip size="sm" variant="flat">
              {getCount()}
            </Chip>
          </h1>
          <p className="text-default-500 mt-1">
            Manage your AutoSense inventory content.
          </p>
        </div>

        {isMainView && (
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

      {/* CONTENT AREA */}
      <div className="flex-1 pb-10">
        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Spinner size="lg" color="primary" label="Scanning Inventory..." />
          </div>
        ) : (
          <>
            {/* SCENARIO A: MAIN VIEW (Split Layout) */}
            {isMainView && (
              <div className="space-y-10">
                {/* Section 1: Unexplored */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-default-500">
                    {/* <Sparkles size={16} className="text-warning" /> */}
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Ready to Create
                    </h3>
                    <Chip
                      size="sm"
                      variant="flat"
                      color="warning"
                      className="h-5 text-[10px]"
                    >
                      {unexploredCars.length}
                    </Chip>
                  </div>
                  <CarGrid
                    data={unexploredCars}
                    emptyMessage="All vehicles have stories! Add more inventory to generate new ones."
                    forceVariant="unexplored"
                  />
                </div>

                {/* <Divider /> */}

                {/* Section 2: Showroom */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-default-500">
                    {/* <Film size={16} className="text-success" /> */}
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Live Showroom
                    </h3>
                    <Chip
                      size="sm"
                      variant="flat"
                      color="success"
                      className="h-5 text-[10px]"
                    >
                      {showroomCars.length}
                    </Chip>
                  </div>
                  <CarGrid
                    data={showroomCars}
                    emptyMessage="No stories generated yet. Pick a car above to start!"
                    forceVariant="showroom"
                  />
                </div>
              </div>
            )}

            {/* SCENARIO B: SUB-VIEWS (Published / Trash) */}
            {isPublishedView && (
              <CarGrid
                data={showroomCars}
                emptyMessage="No published stories found."
              />
            )}

            {isTrashView && (
              <CarGrid
                data={trashCars}
                emptyMessage="Trash is empty."
                forceVariant="trash"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
