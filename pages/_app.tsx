import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { SdsSelectionsProvider } from "@/hooks/sdsSelection";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="text-black dark:text-white bg-white dark:bg-neutral-800">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <SdsSelectionsProvider>
        <Component {...pageProps} />
      </SdsSelectionsProvider>
    </div>
  );
}

export default MyApp;
