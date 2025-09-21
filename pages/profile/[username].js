import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getUserByUsername, getUserPosts } from "../../lib/userServices";
import PostCard from "../../components/PostCard";

export default function ProfilePage() {
  const router = useRouter();
  const { username } = router.query;

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!username) return;
    (async () => {
      const userData = await getUserByUsername(username);
      setUser(userData);
      if (userData) {
        const userPosts = await getUserPosts(userData.uid);
        setPosts(userPosts);
      }
    })();
  }, [username]);

  if (!user) return <p className="text-center text-gray-400">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto py-6 text-white">
      {/* Profile Header */}
      <div className="flex gap-6 items-center mb-8">
        <img
          src={user.profilePic || "/default-avatar.png"}
          alt="profile"
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <p className="text-gray-400">{user.bio}</p>
          <div className="flex gap-6 mt-2">
            <span>{user.followers?.length || 0} followers</span>
            <span>{user.following?.length || 0} following</span>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-2">
        {posts.map((post) => (
          <div key={post.id} className="aspect-square overflow-hidden">
            <img
              src={post.mediaUrl}
              alt={post.caption}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
