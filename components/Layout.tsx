import { HeartIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";

const Layout = (props: { title?: string; heading?: string; children?: ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center max-w-screen-lg mx-auto">
      <Head>
        <title>Merckury{props.title !== undefined ? ` | ${props.title}` : ""}</title>
        <link rel="icon" href="/favicon-16x16.png" />
      </Head>

      <header className="flex w-full justify-center items-center p-4 mt-8">
        <img src="/merck-logo.svg" alt="" />
        {props.heading !== undefined ? (
          <div className="border-l-4 border-l-black h-10 ml-3" />
        ) : null}
        <h1 className="text-3xl font-bold -mt-[1.5px] ml-3">{props.heading}</h1>
      </header>

      <main className="flex w-full flex-1 flex-col items-center justify-start px-20 mt-10">
        {props.children}
      </main>

      <footer className="flex flex-col h-28 w-full items-center justify-center border-t">
        <div className="space-x-4 mb-4 pb-4 px-16 border-b">
          <Link className="hover:underline" href="/">
            Home
          </Link>
          <Link className="hover:underline" href="/upload">
            Upload SDS
          </Link>
        </div>

        <div className="flex">
          Made with <HeartIcon className="w-6 h-6 mx-1 text-red-500" /> by
          <a
            className="ml-1 hover:text-merck-teal"
            href="https://www.merck.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Merck &amp; Co.
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
