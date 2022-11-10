import TextInput from "@/components/TextInput";
import clsxm from "@/utils/clsxm";
import { SafetyDataSheet, searchSds, SearchType } from "@/utils/api";
import { FormEvent, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState(SearchType.casNumber);
  const [searchResults, setSearchResults] = useState<SafetyDataSheet[]>([]);

  let searchTypeLabel =
    searchType === SearchType.casNumber
      ? "CAS Number"
      : searchType === SearchType.productName
      ? "Product Name"
      : "Product Number";

  useEffect(() => {
    const fetchSearchResults = async () => {
      setSearchResults(await searchSds(query, searchType));
    };

    if (query.length !== 0) {
      fetchSearchResults();
    }
  }, [query, searchType]);

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query.length !== 0) {
      console.log("Searching %s by %s..", query, searchTypeLabel);
    }
  };

  return (
    <div>
      <form className="w-11/12 mx-auto" onSubmit={search}>
        <fieldset className="relative border-2 border-merck-teal">
          <legend className="text-merck-teal font-semibold ml-1 -mb-3 px-1 pb-1">
            Search by {searchTypeLabel}
          </legend>
          <TextInput
            className="w-full pl-3 border-0 focus:ring-0 bg-transparent"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <button
            className="absolute grid grid-cols-2 w-12 top-0 right-0 m-[6px] text-black focus:outline-none"
            type="submit"
          >
            <MagnifyingGlassIcon width={20} height={20} />
            <Listbox
              as="div"
              className="relative inline-block"
              value={searchType}
              onChange={setSearchType}
            >
              <Listbox.Button className="ml-1">
                <ChevronDownIcon width={16} height={16} />
              </Listbox.Button>

              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Listbox.Options className="absolute border-2 border-merck-teal bg-white py-1 right-0 w-44 text-left mt-4 origin-top-right shadow-lg focus:outline-none">
                  <Listbox.Option value={SearchType.casNumber}>
                    {({ selected, active }) => (
                      <div className="relative">
                        <div
                          className={clsxm(
                            "pl-8 py-1",
                            active ? "bg-zinc-200" : "bg-white"
                          )}
                        >
                          CAS Number
                        </div>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-merck-teal">
                            <CheckIcon className="w-5" />
                          </span>
                        ) : null}
                      </div>
                    )}
                  </Listbox.Option>
                  <Listbox.Option value={SearchType.productName}>
                    {({ selected, active }) => (
                      <div className="relative">
                        <div
                          className={clsxm(
                            "pl-8 py-1",
                            active ? "bg-zinc-200" : "bg-white"
                          )}
                        >
                          Product Name
                        </div>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-merck-teal">
                            <CheckIcon className="w-5" />
                          </span>
                        ) : null}
                      </div>
                    )}
                  </Listbox.Option>
                  <Listbox.Option value={SearchType.productNumber}>
                    {({ selected, active }) => (
                      <div className="relative">
                        <div
                          className={clsxm(
                            "pl-8 py-1",
                            active ? "bg-zinc-200" : "bg-white"
                          )}
                        >
                          Product Number
                        </div>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-merck-teal">
                            <CheckIcon className="w-5" />
                          </span>
                        ) : null}
                      </div>
                    )}
                  </Listbox.Option>
                </Listbox.Options>
              </Transition>
            </Listbox>
          </button>
        </fieldset>
      </form>

      <div className="mt-8">
        {searchResults.length > 0 ? (
          <table className="table-auto border-2 border-merck-teal border-collapse">
            <thead>
              <tr>
                <th scope="col" className="border border-black px-6 py-2">
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
                <tr>
                  <td className="border border-black">
                    <a href={result.pdf_download_url}>
                      <DocumentArrowDownIcon className="mx-auto h-5 w-5" />
                    </a>
                  </td>
                  <td className="border border-black">{result.id}</td>
                  <td className="border border-black">{result.product_name}</td>
                  <td className="border border-black">
                    {result.product_brand}
                  </td>
                  <td className="border border-black">
                    {result.product_number}
                  </td>
                  <td className="border border-black">{result.cas_number}</td>
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
