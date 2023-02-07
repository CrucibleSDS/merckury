import { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useDropzone } from "react-dropzone";
import clsxm from "@/utils/clsxm";
import { SafetyDataSheet, SafetyDataSheetUploadFailure, uploadSds } from "@/utils/api";
import { PropagateLoader } from "react-spinners";
import Link from "next/link";
import prettyBytes from "pretty-bytes";

const UploadSdsPage: NextPage = () => {
  const onDrop = useCallback((files: File[]) => setUploads(files), []);

  const [uploads, setUploads] = useState<File[]>([]);
  const [sdses, setSdses] = useState<SafetyDataSheet[]>([]);
  const [postUploadFailures, setPostUploadFailures] = useState<SafetyDataSheetUploadFailure[]>([]);

  useEffect(() => {
    const uploadFile = async (sdsFile: File) => {
      try {
        const res = await uploadSds(sdsFile);
        setSdses((sdses) => sdses.concat(res));
      } catch (err) {
        if ((err as SafetyDataSheetUploadFailure).file !== undefined) {
          setPostUploadFailures((failures) =>
            failures.concat(err as SafetyDataSheetUploadFailure)
          );
        } else {
          throw err;
        }
      }
    };

    if (uploads.length !== 0) {
      if (postUploadFailures.length > 0) {
        setPostUploadFailures([]);
      }

      for (const upload of uploads) {
        uploadFile(upload);
      }
    }
  }, [uploads]);

  const { fileRejections, getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 10,
    multiple: true,
  });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.name} className="mb-2">
      {file.name} - {prettyBytes(file.size)}
      <ul>
        {errors.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  const postUploadFailureItems = postUploadFailures.map((failure) => (
    <li key={failure.file.name} className="mb-2">
      {failure.file.name} - {prettyBytes(failure.file.size)}
      <ul>
        <li key={failure.statusCode}>
          {failure.statusCode === 409
            ? "SDS already exists in database"
            : failure.statusCode === 500
            ? "Unknown error"
            : "Failed to parse SDS"}
        </li>
      </ul>
    </li>
  ));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center max-w-screen-lg mx-auto">
      <Head>
        <title>Merckury | Upload SDS</title>
        <link rel="icon" href="/favicon-16x16.png" />
      </Head>

      <header className="flex w-full justify-center items-center p-4 mt-8">
        <img src="/merck-logo.svg" alt="" />
        <div className="border-l-4 border-l-black h-10 ml-3" />
        <h1 className="text-3xl font-bold -mt-[1.5px] ml-3">SDS Upload</h1>
      </header>

      <main className="flex w-full flex-1 flex-col items-center justify-start px-20 mt-10">
        {uploads.length === 0 && sdses.length === 0 ? (
          <>
            <div className="flex items-center justify-center w-full" {...getRootProps()}>
              <label
                htmlFor="dropzone-file"
                className={clsxm(
                  "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100",
                  isDragActive ? "border-merck-teal" : "border-gray-300"
                )}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    aria-hidden="true"
                    className="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className={clsxm(isDragActive ? "" : "font-semibold")}>
                      Click to upload
                    </span>{" "}
                    or{" "}
                    <span className={clsxm(isDragActive ? "font-semibold" : "")}>
                      drag and drop
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">SDS PDF only</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" {...getInputProps()} />
              </label>
            </div>
            <p className="my-4 text-red-500 font-bold">{fileRejectionItems}</p>
          </>
        ) : uploads.length !== 0 &&
          sdses.length < uploads.length &&
          fileRejections.length === 0 &&
          postUploadFailures.length === 0 ? (
          <PropagateLoader color="#007a73" />
        ) : (
          <div className="flex flex-col items-center w-full">
            <div
              className={clsxm(
                "text-xl rounded py-3 px-6 w-full font-bold text-white text-center mb-4",
                postUploadFailures.length === 0
                  ? "bg-emerald-400"
                  : postUploadFailures.length >= uploads.length
                  ? "bg-red-400"
                  : "bg-yellow-400"
              )}
            >
              {postUploadFailures.length === 0
                ? "Uploads successful!"
                : postUploadFailures.length >= uploads.length
                ? "All uploads failed."
                : "Some uploads were successful."}
            </div>
            <span
              className="hover:font-semibold hover:underline underline-offset-4 transition-all duration-150 cursor-pointer"
              onClick={() => {
                setUploads([]);
                setSdses([]);
                setPostUploadFailures([]);
              }}
            >
              Have more to upload?
            </span>
            <p className="my-4 text-red-500 font-bold">{postUploadFailureItems}</p>
          </div>
        )}
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

export default UploadSdsPage;
