import { useSelector } from "react-redux";
import Login from "./login";
import { useRouter } from "next/router";
export default function Home() {
  const user = useSelector((state) => state.user);
  if (user?.currentUser) {
    const router = useRouter();
    router.push("/home");
  } else {
    return <Login />;
  }
}
