import TextInput from "@/components/TextInput";
import { SafetyDataSheet, searchSds } from "@/utils/api";
import { FormEvent, useEffect, useState } from "react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { PropagateLoader } from "react-spinners";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SafetyDataSheet[]>([]);
  const [loading, setLoading] = useState(false);
  const abortController = new AbortController();

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);

      const sds = await searchSds(query, abortController.signal);
      if (sds !== null) {
        setSearchResults(sds);
        setLoading(false);
      }
    };

    if (query.length !== 0) {
      fetchSearchResults();
    } else {
      abortController.abort();
      setLoading(false);
      setSearchResults([]);
    }

    return () => {
      abortController.abort();
    };
  }, [query]);

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="w-11/12">
      <form className="w-11/12 mx-auto" onSubmit={search}>
        <fieldset className="relative border-2 border-merck-teal">
          <legend className="text-merck-teal text-left font-semibold ml-1 -mb-3 px-1 pb-1">
            Search SDS Documents
          </legend>
          <TextInput
            className="w-full pl-3 border-0 focus:ring-0 bg-transparent"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <button
            className="absolute w-6 top-0 right-0 m-[6px] text-black focus:outline-none"
            type="submit"
          >
            <MagnifyingGlassIcon width={20} height={20} />
          </button>
        </fieldset>
      </form>

      <div className="my-10">
        {loading ? (
          <PropagateLoader color="#007a73" />
        ) : searchResults.length > 0 ? (
          <table className="table-auto border-2 border-merck-teal border-collapse">
            <thead className="bg-merck-teal text-white">
              <tr>
                <th scope="col" className="border border-black px-3 py-2">
                  PDF
                </th>
                <th scope="col" className="border border-black px-6 py-2">
                  ID
                </th>
                <th scope="col" className="border border-black px-6 py-2">
                  Product Name
                </th>
                <th scope="col" className="border border-black px-6 py-2">
                  Product Brand
                </th>
                <th scope="col" className="border border-black px-6 py-2">
                  Product Number
                </th>
                <th scope="col" className="border border-black px-6 py-2">
                  CAS Number
                </th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result) => (
                <tr className="even:bg-gray-200">
                  <td scope="col" className="border-x border-black">
                    <a href={result.pdf_download_url}>
                      <DocumentArrowDownIcon className="mx-auto h-5 w-5" />
                    </a>
                  </td>
                  <td scope="col" className="border-x border-black p-1">
                    {result.id}
                  </td>
                  <td scope="col" className="border-x border-black p-1">
                    {result.product_name}
                  </td>
                  <td scope="col" className="border-x border-black p-1">
                    {result.product_brand}
                  </td>
                  <td scope="col" className="border-x border-black p-1">
                    {result.product_number}
                  </td>
                  <td scope="col" className="border-x border-black p-1">
                    {result.cas_number}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : query.length > 0 ? (
          <p>No results found.</p>
        ) : null}
      </div>
    </div>
  );
};

export default SearchBar;
