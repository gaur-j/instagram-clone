import { useDispatch, useSelector } from "react-redux";
import { followThunk, unfollowThunk } from "@/redux/profileSlice";

export default function ProfileHeader({ profile }) {
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.user.currentUser);
  const isMe = currentUser?.uid === profile.uid;
  const amFollowing = (currentUser?.following || []).include(profile.uid);

  const follow = () =>
    dispatch(
      followThunk({ currentUid: currentUser.uid, targetUid: profile.uid })
    );
  const unfollow = () =>
    dispatch(
      unfollowThunk({ currentUid: currentUser.uid, targetUid: profile.uid })
    );

  return (
    <div className="flex items-center gap-6">
      <img
        src={profile.profilePic || "/default-avatar.png"}
        className="w-24 h-24 rounded-full border"
      />
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{profile.username}</h2>
          {!isMe &&
            (amFollowing ? (
              <button
                onClick={unfollow}
                className="px-3 py-1 rounded-xl border"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={follow}
                className="px-3 py-1 rounded-xl bg-blue-600 text-white"
              >
                Follow
              </button>
            ))}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          <b>{profile.followers?.length || 0}</b> followers ·{" "}
          <b>{profile.following?.length || 0}</b> following
        </div>
        <p className="mt-1">{profile.bio}</p>
      </div>
    </div>
  );
}
