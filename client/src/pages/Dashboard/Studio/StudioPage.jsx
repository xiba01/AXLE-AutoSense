import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchStudioData,
  softDeleteStory,
  restoreStory,
} from "../../../store/slices/studioSlice";
import { Sparkles, LayoutGrid } from "lucide-react";
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
        <div className="flex flex-col items-center justify-center py-16 text-default-400 border border-dashed border-default-200 rounded-2xl">
          <LayoutGrid size={20} className="opacity-40 mb-2" />
          <p className="text-sm text-default-500">{emptyMessage}</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((car) => (
          <StudioCard
            key={car.id}
            car={car}
            variant={forceVariant || "auto"}
            onGenerate={handleGenerate}
            onPlay={handlePlay}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            {getPageTitle()}
            <span className="text-sm font-medium text-default-400 bg-default-100 px-2 py-0.5 rounded-md">
              {getCount()}
            </span>
          </h1>
          <p className="text-default-500 mt-1 text-sm">
            Manage your AutoSense content
          </p>
        </div>

        {isMainView && (
          <button
            onClick={() => navigate("/dashboard/studio/wizard")}
            className="flex items-center gap-2 bg-foreground text-background font-medium px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            <Sparkles size={16} />
            Create Story
          </button>
        )}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 pb-10">
        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
              <span className="text-sm text-default-500">
                Loading inventory...
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* SCENARIO A: MAIN VIEW (Split Layout) */}
            {isMainView && (
              <div className="space-y-10">
                {/* Section 1: Unexplored */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-medium text-default-500">
                      Ready to Create
                    </h3>
                    <span className="text-xs text-default-400">
                      {unexploredCars.length}
                    </span>
                  </div>
                  <CarGrid
                    data={unexploredCars}
                    emptyMessage="All vehicles have stories"
                    forceVariant="unexplored"
                  />
                </div>

                {/* Section 2: Showroom */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-medium text-default-500">
                      Live Showroom
                    </h3>
                    <span className="text-xs text-default-400">
                      {showroomCars.length}
                    </span>
                  </div>
                  <CarGrid
                    data={showroomCars}
                    emptyMessage="No stories generated yet"
                    forceVariant="showroom"
                  />
                </div>
              </div>
            )}

            {/* SCENARIO B: SUB-VIEWS (Published / Trash) */}
            {isPublishedView && (
              <CarGrid
                data={showroomCars}
                emptyMessage="No published stories found"
              />
            )}

            {isTrashView && (
              <CarGrid
                data={trashCars}
                emptyMessage="Trash is empty"
                forceVariant="trash"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
