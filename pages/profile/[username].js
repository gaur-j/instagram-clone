import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function profilePage() {
  const { query } = useRouter();
  const { username } = query;
  const user = useSelector((state) => state.user);

  if (!username) return <p>loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-6">
        <img
          src={user?.profilePic || "/default-avatar.png"}
          alt="profile"
          className="w-24 h-24 rounded-full border"
        />
        <div>
          <h2 className="text-2xl font-bold">{user?.username || "Unknown"}</h2>
          <p className="text-gray-600">{user?.bio || "No bio yet"}</p>
        </div>
      </div>
    </div>
  );
}
