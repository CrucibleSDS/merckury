import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SdsSelectionsProvider } from "@/hooks/sdsSelection";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SdsSelectionsProvider>
      <Component {...pageProps} />
    </SdsSelectionsProvider>
  );
}

export default MyApp;
