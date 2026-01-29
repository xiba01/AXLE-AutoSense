import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../config/supabaseClient"; // Adjust path if needed relative to folder structure
import { useStoryStore } from "../../store/useStoryStore";
import { Loader2, AlertCircle } from "lucide-react";

export default function AutoSenseLoader({ children }) {
  const { storyId } = useParams();
  const { loadStory, isLoading } = useStoryStore();
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      if (!storyId) return;

      try {
        // 1. Fetch the JSON blob from Supabase
        const { data, error } = await supabase
          .from("stories")
          .select("content, generation_status")
          .eq("id", storyId)
          .single();

        if (error) throw error;

        // 2. Check Status
        if (data.generation_status !== "complete") {
          setFetchError(
            `Story is ${data.generation_status}. Please wait for AI generation to finish.`,
          );
          return;
        }

        // 3. Hydrate the Store
        if (data.content) {
          loadStory(data.content);
        } else {
          throw new Error("Story content is empty");
        }
      } catch (err) {
        console.error("AutoSense Load Error:", err);
        setFetchError(
          "Failed to load story. It may not exist or you lack permission.",
        );
      }
    };

    fetchStory();
  }, [storyId, loadStory]);

  // --- RENDERING STATES ---

  if (fetchError) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white">
        <AlertCircle className="size-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold">Unable to Load Experience</h2>
        <p className="text-neutral-400 mt-2">{fetchError}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="size-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold animate-pulse">
          Initializing AutoSense...
        </h2>
        <p className="text-neutral-500 text-sm mt-2">
          Loading Assets & Physics Engine
        </p>
      </div>
    );
  }

  // Once loaded, render the Player (children)
  return <>{children}</>;
}
