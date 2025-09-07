import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { publishPost } from "@/redux/postsSlice";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

export default function PostComposer() {
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.user.currentUser);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file || !currentUser) return;
    setLoading(true);
    try {
      const upload = await uploadToCloudinary(file);
      if (!upload.secure_url) {
        throw new Error("Cloudinary upload failed — no URL returned");
      }
      const mediaUrl = upload.secure_url;
      const mediaType = upload.resource_type === "video" ? "video" : "image"; // 'image' or 'video'
      await dispatch(
        publishPost({
          userId: currentUser.uid,
          mediaType,
          mediaUrl,
          caption,
        })
      ).unwrap();
      setFile(null);
      setCaption("");
    } catch (err) {
      console.error(err);
      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <form
        onSubmit={onSubmit}
        className="bg-gray-600 rounded-2xl shadow p-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full"
          />
        </div>
        <textarea
          className="mt-3 w-full border rounded-xl p-3"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a Caption..."
          rows={2}
        />
        <button
          disabled={loading || !file}
          className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50"
        >
          {loading ? "Posting" : "Post"}
        </button>
      </form>
    </div>
  );
}
