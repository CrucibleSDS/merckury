import TextInput from "@/components/TextInput";
import { getBatchSds, SafetyDataSheet, SafetyDataSheetSearchResult, searchSds } from "@/utils/api";
import { FormEvent, useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { PropagateLoader } from "react-spinners";
import clsxm from "@/utils/clsxm";

const SEARCH_LIMIT_PER_PAGE = 20;

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [prevQuery, setPrevQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SafetyDataSheetSearchResult | null>(null);
  const [sdsResults, setSdsResults] = useState<SafetyDataSheet[]>([]);
  const [searchOffset, setSearchOffset] = useState(0);
  const [loadingSds, setLoadingSds] = useState(false);
  const abortController = new AbortController();

  useEffect(() => {
    const fetchSearchResults = async () => {
      const sds = await searchSds(
        query,
        SEARCH_LIMIT_PER_PAGE,
        searchOffset,
        abortController.signal
      );
      if (sds !== null) {
        setSearchResult(sds);
        setLoadingSds(true);
      }
    };

    if (query.length !== 0) {
      if (query !== prevQuery) {
        setSearchOffset(0);
        setPrevQuery(query);
      }

      fetchSearchResults();
    } else {
      abortController.abort();
      setSearchOffset(0);
      setPrevQuery("");
      setSearchResult(null);
    }

    return () => {
      abortController.abort();
    };
  }, [query, prevQuery, searchOffset]);

  useEffect(() => {
    const fetchSds = async () => {
      if (searchResult !== null) {
        setLoadingSds(true);
        const sds = await getBatchSds(
          searchResult.hits.map((hit) => hit.id),
          abortController.signal
        );

        if (sds !== null) {
          setSdsResults(sds);
        }
        setLoadingSds(false);
      }
    };

    if (searchResult !== null && searchResult.hits.length > 0) {
      fetchSds();
    } else {
      abortController.abort();
      setSdsResults([]);
      setLoadingSds(false);
    }

    return () => {
      abortController.abort();
    };
  }, [searchResult]);

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const nextPage = () => {
    if (searchResult !== null && searchResult.estimatedTotalHits - searchOffset > 0) {
      setSearchOffset((offset) => offset + SEARCH_LIMIT_PER_PAGE);
    }
  };

  const previousPage = () => {
    if (searchOffset >= SEARCH_LIMIT_PER_PAGE) {
      setSearchOffset((offset) => offset - SEARCH_LIMIT_PER_PAGE);
    } else if (searchOffset > 0) {
      setSearchOffset(0);
    }
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
        {(searchResult === null || (loadingSds && sdsResults.length === 0)) &&
        query.length !== 0 ? (
          <PropagateLoader color="#007a73" />
        ) : searchResult !== null && (searchResult.hits.length > 0 || searchOffset > 0) ? (
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
                <th scope="col" className="border border-black px-6 py-2">
                  Hazards
                </th>
              </tr>
            </thead>
            <tbody>
              {sdsResults.map((result) => (
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
                  <td scope="col" className="border-x border-black p-1">
                    <div className="grid grid-cols-3 gap-1 m-1">
                      {result.hazards.map((hazard) => (
                        <img src={`/assets/${hazard}.svg`} alt={hazard} className="w-8 h-8" />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {searchResult.hits.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <p className="my-1">No remaining results.</p>
                  </td>
                </tr>
              ) : null}
            </tbody>
            <tfoot className="border-t-2 border-merck-teal">
              <tr>
                <td colSpan={6} className="w-32">
                  <div
                    className={clsxm(
                      "inline-block float-left cursor-pointer my-1",
                      searchOffset > 0 ? "" : "invisible"
                    )}
                    onClick={previousPage}
                  >
                    <ChevronLeftIcon className="inline-block w-6 h-6" />
                    <span className="text-sm">Previous</span>
                  </div>
                  <div
                    className={clsxm(
                      "inline-block float-right cursor-pointer my-1",
                      searchResult.hits.length < SEARCH_LIMIT_PER_PAGE ? "invisible" : ""
                    )}
                    onClick={nextPage}
                  >
                    <span className="text-sm">Next</span>
                    <ChevronRightIcon className="inline-block w-6 h-6" />
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        ) : query.length > 0 ? (
          <p>No results found.</p>
        ) : null}
      </div>
    </div>
  );
};

export default SearchBar;
