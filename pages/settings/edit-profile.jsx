import { useSelector } from "react-redux";
import { useState } from "react";
import { updateUser } from "@/lib/userServices";

export default function EditProfile() {
  const user = useSelector((state) => state.user);
  const [bio, setBio] = useState(user?.bio || "");
  const [loading, setLoading] = useState(null);

  const handleSave = async (params) => {
    setLoading(true);
    await updateUser(user?.bio, { bio });
    setLoading(false);
    alert("Profile Updated!");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb04">Edit Profile</h2>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full rounded-md border p-2"
        rows="3"
      />
      <button
        className="mt=3 bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
