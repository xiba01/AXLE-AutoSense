import React from "react";
import { useNavigate } from "react-router-dom";
import AutoSenseLoader from "../../../components/AutoSense/AutoSenseLoader";
import { EditorView } from "../../../components/AutoSense/editor/EditorView";
import { Button } from "@heroui/react";
import { X } from "lucide-react";

export default function EditorPage() {
  const navigate = useNavigate();

  // Handle exiting the full-screen editor
  const handleExit = () => {
    // Navigate back to the Studio Dashboard
    navigate("/dashboard/studio");
  };

  return (
    // Load Data First
    <AutoSenseLoader>
      {/* Full Screen Overlay Container */}
      <div className="fixed inset-0 z-[100] bg-black text-white overflow-hidden flex flex-col">
        {/* Editor Shell */}
        <EditorView onExit={handleExit} />
      </div>
    </AutoSenseLoader>
  );
}
