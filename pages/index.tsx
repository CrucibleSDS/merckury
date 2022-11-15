import type { NextPage } from "next";
import Head from "next/head";
import { HeartIcon } from "@heroicons/react/24/solid";
import SearchBar from "@/components/SearchBar";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center max-w-screen-lg mx-auto">
      <Head>
        <title>Merckury</title>
        <link rel="icon" href="/favicon-16x16.png" />
      </Head>

      <header className="flex w-full justify-center items-center p-4 mt-8">
        <img src="/merck-logo.svg" alt="" />
        <div className="border-l-4 border-l-black h-10 ml-3" />
        <h1 className="text-3xl font-bold -mt-[1.5px] ml-3">SDS Search</h1>
      </header>

      <main className="flex w-full flex-1 flex-col items-center justify-start px-20 mt-10 text-center">
        <SearchBar />
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        Made with <HeartIcon className="w-6 h-6 mx-1 text-red-500" /> by
        <a
          className="ml-1 hover:text-merck-teal"
          href="https://www.merck.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Merck &amp; Co.
        </a>
      </footer>
    </div>
  );
};

export default Home;
