import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Car,
  Sparkles,
  Plus,
  Wand2,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Play,
  Settings,
  Clock,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";

import { fetchInventory } from "../../store/slices/inventorySlice";
import { fetchStudioData } from "../../store/slices/studioSlice";

export default function DashboardHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { inventory } = useSelector((state) => state.inventory);
  const { items: studioItems } = useSelector((state) => state.studio);
  const { profile } = useSelector((state) => state.dealer);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchInventory());
    dispatch(fetchStudioData());
  }, [dispatch]);

  // Real data: Cars with active stories (sorted by story creation date)
  const recentStories = useMemo(() => {
    if (!studioItems) return [];
    return studioItems
      .filter((car) => car.hasActiveStory && car.story)
      .sort(
        (a, b) => new Date(b.story.created_at) - new Date(a.story.created_at),
      )
      .slice(0, 4);
  }, [studioItems]);

  // Real data: Cars without stories
  const carsNeedingStories = useMemo(() => {
    if (!studioItems) return [];
    return studioItems.filter((car) => !car.hasActiveStory).slice(0, 4);
  }, [studioItems]);

  // Calculate AI coverage
  const totalCars = inventory?.length || 0;
  const carsWithStories = recentStories?.length
    ? studioItems?.filter((c) => c.hasActiveStory).length
    : 0;
  const coveragePercent =
    totalCars > 0 ? Math.round((carsWithStories / totalCars) * 100) : 0;

  // Public showroom URL
  const showroomUrl = user?.id ? `/sites/${user.id}` : null;

  // Format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {profile?.dealership_name || "Dashboard"}
          </h1>
          <p className="text-sm text-foreground/50 mt-0.5">
            Manage your inventory and AI-powered stories
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/dashboard/inventory")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-foreground/10 text-foreground text-sm font-medium hover:bg-foreground/5 active:scale-[0.98] transition-all"
          >
            <Plus size={16} />
            Add Vehicle
          </button>
          <button
            onClick={() => navigate("/dashboard/studio/wizard")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 active:scale-[0.98] transition-all"
          >
            <Wand2 size={16} />
            Create Story
          </button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <button
          onClick={() => navigate("/dashboard/inventory")}
          className="group p-4 rounded-xl border border-foreground/5 bg-background hover:border-foreground/10 transition-all text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="size-9 rounded-lg bg-foreground/5 flex items-center justify-center">
              <Car size={16} className="text-foreground/60" />
            </div>
            <ArrowUpRight
              size={14}
              className="text-foreground/20 group-hover:text-foreground/50 transition-colors"
            />
          </div>
          <p className="text-sm font-medium text-foreground">Inventory</p>
          <p className="text-xs text-foreground/40 mt-0.5">
            {totalCars} vehicles
          </p>
        </button>

        <button
          onClick={() => navigate("/dashboard/studio")}
          className="group p-4 rounded-xl border border-foreground/5 bg-background hover:border-foreground/10 transition-all text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="size-9 rounded-lg bg-foreground/5 flex items-center justify-center">
              <Sparkles size={16} className="text-foreground/60" />
            </div>
            <ArrowUpRight
              size={14}
              className="text-foreground/20 group-hover:text-foreground/50 transition-colors"
            />
          </div>
          <p className="text-sm font-medium text-foreground">Studio</p>
          <p className="text-xs text-foreground/40 mt-0.5">
            {carsWithStories} stories
          </p>
        </button>

        <button
          onClick={() => showroomUrl && window.open(showroomUrl, "_blank")}
          disabled={!showroomUrl}
          className="group p-4 rounded-xl border border-foreground/5 bg-background hover:border-foreground/10 transition-all text-left disabled:opacity-50"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="size-9 rounded-lg bg-foreground/5 flex items-center justify-center">
              <ExternalLink size={16} className="text-foreground/60" />
            </div>
            <ArrowUpRight
              size={14}
              className="text-foreground/20 group-hover:text-foreground/50 transition-colors"
            />
          </div>
          <p className="text-sm font-medium text-foreground">Public Showroom</p>
          <p className="text-xs text-foreground/40 mt-0.5">View live site</p>
        </button>

        <button
          onClick={() => navigate("/dashboard/settings")}
          className="group p-4 rounded-xl border border-foreground/5 bg-background hover:border-foreground/10 transition-all text-left"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="size-9 rounded-lg bg-foreground/5 flex items-center justify-center">
              <Settings size={16} className="text-foreground/60" />
            </div>
            <ArrowUpRight
              size={14}
              className="text-foreground/20 group-hover:text-foreground/50 transition-colors"
            />
          </div>
          <p className="text-sm font-medium text-foreground">Settings</p>
          <p className="text-xs text-foreground/40 mt-0.5">
            Account & branding
          </p>
        </button>
      </motion.div>

      {/* AI Coverage Progress */}
      <motion.div
        variants={itemVariants}
        className="p-5 rounded-xl border border-foreground/5 bg-background"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-foreground/5 flex items-center justify-center">
              <Layers size={16} className="text-foreground/60" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Story Coverage
              </p>
              <p className="text-xs text-foreground/40">
                {carsWithStories} of {totalCars} vehicles
              </p>
            </div>
          </div>
          <span className="text-sm font-semibold text-foreground">
            {coveragePercent}%
          </span>
        </div>
        <div className="relative h-2 rounded-full bg-foreground/5 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-foreground rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${coveragePercent}%` }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.2,
            }}
          />
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Stories */}
        <motion.div variants={itemVariants}>
          <div className="rounded-xl border border-foreground/5 bg-background">
            <div className="flex items-center justify-between p-4 border-b border-foreground/5">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-foreground/50" />
                <h2 className="text-sm font-semibold text-foreground">
                  Recent Stories
                </h2>
              </div>
              <button
                onClick={() => navigate("/dashboard/studio")}
                className="text-xs text-foreground/50 hover:text-foreground transition-colors flex items-center gap-1"
              >
                View all
                <ArrowRight size={12} />
              </button>
            </div>

            {recentStories.length === 0 ? (
              <div className="p-8 text-center">
                <div className="size-12 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-3">
                  <Sparkles size={20} className="text-foreground/30" />
                </div>
                <p className="text-sm text-foreground/50 mb-3">
                  No stories created yet
                </p>
                <button
                  onClick={() => navigate("/dashboard/studio/wizard")}
                  className="text-sm font-medium text-foreground hover:underline"
                >
                  Create your first story →
                </button>
              </div>
            ) : (
              <div className="divide-y divide-foreground/5">
                {recentStories.map((car) => (
                  <div
                    key={car.id}
                    className="flex items-center gap-3 p-3 hover:bg-foreground/2 transition-colors group"
                  >
                    <div className="size-12 rounded-lg bg-foreground/5 overflow-hidden shrink-0">
                      {car.photos?.[0] ? (
                        <img
                          src={car.photos[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car size={16} className="text-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {car.year} {car.make} {car.model}
                      </p>
                      <p className="text-xs text-foreground/40 flex items-center gap-1 mt-0.5">
                        <Clock size={10} />
                        {formatRelativeTime(car.story.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        window.open(`/experience/${car.story.id}`, "_blank")
                      }
                      className="size-8 rounded-lg bg-foreground/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-foreground/10"
                    >
                      <Play size={14} className="text-foreground/60" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Cars Needing Stories */}
        <motion.div variants={itemVariants}>
          <div className="rounded-xl border border-foreground/5 bg-background">
            <div className="flex items-center justify-between p-4 border-b border-foreground/5">
              <div className="flex items-center gap-2">
                <Car size={16} className="text-foreground/50" />
                <h2 className="text-sm font-semibold text-foreground">
                  Needs Stories
                </h2>
              </div>
              {carsNeedingStories.length > 0 && (
                <span className="text-xs text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded-full">
                  {studioItems?.filter((c) => !c.hasActiveStory).length || 0}{" "}
                  vehicles
                </span>
              )}
            </div>

            {carsNeedingStories.length === 0 ? (
              <div className="p-8 text-center">
                <div className="size-12 rounded-full bg-foreground/5 flex items-center justify-center mx-auto mb-3">
                  <Sparkles size={20} className="text-foreground/30" />
                </div>
                <p className="text-sm text-foreground/50">
                  All vehicles have stories!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-foreground/5">
                {carsNeedingStories.map((car) => (
                  <div
                    key={car.id}
                    className="flex items-center gap-3 p-3 hover:bg-foreground/2 transition-colors group"
                  >
                    <div className="size-12 rounded-lg bg-foreground/5 overflow-hidden shrink-0">
                      {car.photos?.[0] ? (
                        <img
                          src={car.photos[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car size={16} className="text-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {car.year} {car.make} {car.model}
                      </p>
                      <p className="text-xs text-foreground/40 mt-0.5">
                        {car.trim || "No trim"}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        navigate("/dashboard/studio/wizard", { state: { car } })
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-foreground bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-foreground/10"
                    >
                      Generate
                    </button>
                  </div>
                ))}
              </div>
            )}

            {carsNeedingStories.length > 0 && (
              <div className="p-3 border-t border-foreground/5">
                <button
                  onClick={() => navigate("/dashboard/studio")}
                  className="w-full py-2 rounded-lg text-xs font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all flex items-center justify-center gap-1.5"
                >
                  View all vehicles
                  <ArrowRight size={12} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
