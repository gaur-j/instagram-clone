import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// Import async thunks from your slice, NOT service functions
import { togglePostLike, addPostComment } from "@/redux/postsSlice";

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const isLiked = (post.likes || []).includes(currentUser?.uid);
  const [comment, setComment] = useState("");

  const onToggleLike = () => {
    if (!currentUser) return;
    // Dispatch the thunk with expected payload keys (uid, postId, isLiked)
    dispatch(
      togglePostLike({ postId: post.id, uid: currentUser.uid, isLiked })
    );
  };

  const onAddComment = (e) => {
    e.preventDefault();
    if (!comment.trim() || !currentUser) return;
    // Dispatch the thunk to add comment
    dispatch(
      addPostComment({
        postId: post.id,
        uid: currentUser.uid,
        text: comment.trim(),
      })
    );
    setComment("");
  };

  return (
    <div className="bg-transparent rounded-2xl shadow mb-6">
      {/* header */}
      <div className="flex items-center gap-3 p-3">
        <div className="w-9 h-9 rounded-full bg-gray-200" />
        <div className="font-semibold">{post.username || post.userId}</div>
      </div>
      {/* media */}
      <div className="bg-black">
        {post.mediaType === "video" ? (
          <video src={post.mediaUrl} controls className="w-full max-h-[75vh]" />
        ) : (
          <img
            className="w-full max-h-[75vh] object-contain"
            src={post.mediaUrl}
            alt=""
          />
        )}
      </div>
      {/* actions */}
      <div className="p-3">
        <div className="flex items-center gap-4">
          <button onClick={onToggleLike} className="font-semibold">
            {isLiked ? "♥ Liked" : "♡ Like"}
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-700">{post.caption}</div>
      </div>
      {/* comments */}
      <div className="mt-3 space-y-1">
        {(post.comments || []).slice(-3).map((c, i) => (
          <div key={i} className="text-sm">
            <span className="font-semibold">{c.uid}:</span> {c.text}
          </div>
        ))}
      </div>
      {/* add comment */}
      <form onSubmit={onAddComment} className="mt-3 flex gap-2">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="flex-1 border rounded-xl px-3 py-2"
          placeholder="Add a comment..."
        />
        <button className="px-3 py-2 rounded-xl bg-gray-900 text-white">
          Post
        </button>
      </form>
    </div>
  );
}
