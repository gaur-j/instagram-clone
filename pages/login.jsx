import { useState } from "react";
import { auth, signInWithFacebook } from "../lib/firebase";
import { useRouter } from "next/router";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import Image from "next/image";
import insta from "../assets/instagram-logo.png"; // Adjust the path as necessary
import landing from "../assets/landing.png";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { Firestore } from "firebase/firestore";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      let email = form.email;
      if (!email.includes("@")) {
        const snapShot = await Firestore.firestore()
          .collection("users")
          .where("username", "==", email)
          .limit(1)
          .get();
        if (!snapShot.empty) return setError("Username not found.");
        email = snapShot.doc[0].data().email;
      }
      await signInWithEmailAndPassword(auth, email, form.password);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  //Google Login
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  // Facebook Login
  const handleFacebookLogin = async () => {
    try {
      const user = await signInWithFacebook();
      // Optional: Save profile data to Firestore if new user
      router.push("/");
    } catch (error) {
      console.error("Facebook login failed", error);
    }
  };

  return (
    <div className="flex justify-center h-full items-center bg-[rgb(var(--ig-primary-background))] dark:bg-[var(--ig-secondary-background)]">
      <section className="flex p-8 flex-col min-h-full">
        <main className="flex flex-col justify-center flex-1 w-full">
          <article className="w-full mt-8 pt-0 pb-8 ml-auto mr-auto mb-0 border-t-0 flex">
            <div className="h-auto w-xl flex justify-center flex-col items-center flex-1">
              <Image
                src={landing}
                aria-label="Instagram"
                alt="Instagram"
                className="max-w-none h-[450px] ml-[50px] mr-[-50px] rounded-b-none rounded-t-none justify-center items-center object-fill"
              />
            </div>
            <div className="w-full max-w-350px mt-3 justify-center flex flex-col items-center flex-1 text-white">
              <div className="w-[350px] h-[387.188px] flex mb-2 mt-0 pt-2.5 border-t-[#363636] border-b-0 pb-2.5 justify-center flex-col items-center flex-1">
                <Image
                  src={insta}
                  aria-label="Instagram logo"
                  role="img"
                  alt="Instagram logo"
                  className="h-[51px] mb-4 mt-2 bg-left w-[175px] max-w-none mr-[-55px] rounded-b-none rounded-t-none justify-center items-center object-fill"
                />
                <form
                  onSubmit={handleLogin}
                  className="p-2 rounded-xl shadow-md w-2xs mr-[-55px]"
                >
                  <input
                    type="text"
                    name="email"
                    placeholder="Phone no, Username, Email"
                    value={form.email}
                    maxLength={75}
                    onChange={handleChange}
                    className="w-full mb-3 px-3 py-2 border rounded-lg"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full mb-3 px-3 py-2 border rounded-lg"
                    required
                  />

                  {error && (
                    <p className="text-red-500 text-sm mb-2">{error}</p>
                  )}
                  <button
                    type="Submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg mb-3 cursor-pointer hover:bg-blue-600 transition-colors"
                  >
                    Log In
                  </button>

                  <div className="flex items-center my-6">
                    <hr className="flex-1 border-[#262626]" />
                    <span className="px-3 text-sm text-[#a8a8a8] font-semibold">
                      OR
                    </span>
                    <hr className="flex-1 border-[#262626]" />
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      onClick={handleFacebookLogin}
                      className="text-[#0095f6] font-semibold px-8 py-2 rounded-md cursor-pointer flex items-center justify-center"
                    >
                      <FaFacebook className="inline mr-2 text-lg" />
                      Log in with Facebook
                    </button>
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      onClick={handleGoogleLogin}
                      type="button"
                      className="text-[#ff4242] font-semibold px-8 py-2 rounded-md cursor-pointer flex items-center justify-center"
                    >
                      <FaGoogle className="inline mr-2 text-lg" />
                      Continue With Google
                    </button>
                  </div>

                  <div className="mt-6 text-center text-white text-sm justify-evenly">
                    <p className="m-4 inline">
                      Don&apos;t have an account?{" "}
                      <span
                        onClick={() => router.push("/signup")}
                        className="text-[#708dff] hover:font-medium cursor-pointer"
                      >
                        Sign Up
                      </span>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </article>
        </main>
        <footer className="w-full h-auto pt-0 mb-0 mt-0 pb-0 pr-4 text-base pl-4 flex-col flex items-stretch box-border text-white">
          <div className="mb-[52px] ">
            <div className="flex flex-col items-center justify-center text-sm mt-6 bg-transparent">
              <div className="flex-row flex flex-wrap items-center justify-center text-sm mt-6 bg-transparent">
                <div className="mb-3 text-[#a8a8a8] ">
                  <a href="#" className="inline-block mr-4 hover:underline">
                    Meta
                  </a>
                  <a href="#" className="inline-block mr-4 hover:underline">
                    About
                  </a>
                  <a href="#" className="inline-block mr-4 hover:underline">
                    Blog
                  </a>{" "}
                  <a href="#" className="inline-block mr-4 hover:underline">
                    Jobs
                  </a>
                  <a href="#" className="inline-block mr-4 hover:underline">
                    Help
                  </a>
                  <a href="#" className="inline-block mr-4 hover:underline">
                    {" "}
                    API
                  </a>
                  <a href="#" className="inline-block mr-4 hover:underline">
                    Privacy
                  </a>{" "}
                  <a href="">Terms </a>
                  <a href="#" className="inline-block mr-4 hover:underline">
                    Locations{" "}
                  </a>
                  <a href="#" className="inline-block mr-4 hover:underline">
                    Instagram Lite{" "}
                  </a>
                  <a href="#" className="inline-block mr-4 hover:underline">
                    Meta AI{" "}
                  </a>
                  <a href="#" className="inline-block mr-4 hover:underline">
                    Meta AI Articles{" "}
                  </a>
                  <a href="#" className="inline-block mr-4 hover:underline">
                    Threads
                  </a>
                  <a href="#" className="inline-block mr-4 hover:underline">
                    {" "}
                    Contact Uploading & Non-Users{" "}
                  </a>{" "}
                  <a href="#" className="inline-block mr-4 hover:underline">
                    Meta Verified
                  </a>
                </div>
              </div>
              <p className="text-[#a8a8a8] text-sm">
                &copy; {new Date().getFullYear()} Instagram from Meta
              </p>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}
