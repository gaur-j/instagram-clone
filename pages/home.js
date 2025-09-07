import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFeed } from "../redux/postsSlice";
import PostCard from "../components/PostCard";
import PostComposer from "../components/PostComposer";
import Image from "next/image";
import defaultAvatar from "../assest/default.png";

export default function HomePage() {
  const dispatch = useDispatch();
  const { currentUser, loading: userLoading } = useSelector((s) => s.user);
  const { feed, loading: feedLoading } = useSelector((s) => s.posts);

  // Fetch feed on user load
  useEffect(() => {
    if (!currentUser) return;
    const following = currentUser.following || [];
    dispatch(fetchFeed({ userId: currentUser.uid, following }));
  }, [currentUser, dispatch]);

  if (userLoading) return <div className="p-6">Loading user...</div>;
  if (!currentUser) return <div className="p-6">Please log in.</div>;

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 border-r border-gray-800 p-6 hidden md:flex flex-col">
        <h1 className="text-2xl font-bold mb-10">Instagram</h1>
        <nav className="space-y-6 text-lg">
          <button className="flex items-center gap-3 hover:text-gray-400">
            <span>🏠</span> Home
          </button>
          <button className="flex items-center gap-3 hover:text-gray-400">
            🔍 Search
          </button>
          <button className="flex items-center gap-3 hover:text-gray-400">
            🧭 Explore
          </button>
          <button className="flex items-center gap-3 hover:text-gray-400">
            🎬 Reels
          </button>
          <button className="flex items-center gap-3 hover:text-gray-400">
            💬 Messages
          </button>
          <button className="flex items-center gap-3 hover:text-gray-400">
            ❤️ Notifications
          </button>
          <button className="flex items-center gap-3 hover:text-gray-400">
            ➕ Create
          </button>
          <button className="flex items-center gap-3 hover:text-gray-400">
            👤 Profile
          </button>
          <button className="flex items-center gap-3 hover:text-gray-400">
            ☰ More
          </button>
        </nav>
      </aside>

      {/* MAIN FEED */}
      <main className="flex-1 max-w-2xl mx-auto px-4 py-6">
        {/* STORIES BAR */}
        <div className="flex gap-4 overflow-x-auto pb-4 mb-6 border-b border-gray-800">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-2 border-pink-500 overflow-hidden hover:cursor-pointer">
                <Image
                  src={defaultAvatar}
                  alt={`story ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs mt-1">user{i}</span>
            </div>
          ))}
        </div>

        {/* COMPOSER */}
        <PostComposer />

        {/* FEED POSTS */}
        {feedLoading && (
          <div className="text-center text-gray-400 mt-6">Loading feed...</div>
        )}
        <div className="space-y-6">
          {!feedLoading && feed.length === 0 && (
            <p className="text-gray-400 text-center">
              No posts yet. Follow someone or create your first post!
            </p>
          )}
          {!feedLoading &&
            feed
              .filter((post) => post && post.id)
              .map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="w-80 border-l border-gray-800 p-6 hidden lg:flex flex-col">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-8">
          <img
            src={currentUser?.profilePic || "/default-avatar.png"}
            alt="profile"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-semibold">{currentUser?.username}</p>
            <p className="text-gray-400 text-sm">{currentUser?.email}</p>
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-gray-400 text-sm">Suggested for you</h3>
            <button className="text-xs font-semibold">See All</button>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/default-avatar.png"
                  className="w-10 h-10 rounded-full"
                  alt="suggestion"
                />
                <p className="text-sm font-semibold">suggestion{i}</p>
              </div>
              <button className="text-blue-500 text-xs font-bold">
                Follow
              </button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
