import { useState } from "react";
import { supabase } from "../config/supabaseClient";
import { useSelector } from "react-redux";

export const useImageUpload = (bucketName) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const uploadImage = async (file) => {
    if (!file) return null;
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    // 1. Validate File
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG).");
      return null;
    }
    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      setError("File size must be less than 2MB.");
      return null;
    }

    try {
      setUploading(true);
      setError(null);

      // 2. Generate Unique Path
      // Structure: user_id/timestamp_filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // 3. Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 4. Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(fileName);

      return publicUrl;
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.message || "Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
};
