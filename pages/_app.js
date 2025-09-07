import "@/styles/globals.css";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { listenAuthchanges } from "@/lib/authListener";

function MyApp({ Component, pageProps }) {
  // Listen for authentication changes when the app mounts
  useEffect(() => {
    listenAuthchanges();
  }, []);

  return <Component {...pageProps} />;
}

export default function AppWrapper(props) {
  return (
    <Provider store={store}>
      <MyApp {...props} />
    </Provider>
  );
}
