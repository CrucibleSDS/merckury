import TextInput from "@/components/TextInput";
import clsxm from "@/utils/clsxm";
import { FormEvent, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

enum SearchType {
  casNumber,
  productName,
  productNumber,
}

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState(SearchType.casNumber);

  let searchTypeLabel =
    searchType === SearchType.casNumber
      ? "CAS Number"
      : searchType === SearchType.productName
      ? "Product Name"
      : "Product Number";

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query.length !== 0) {
      console.log("Searching %s by %s..", query, searchTypeLabel);

      // TODO: Fetch search results from API
    }
  }

  return (
    <form className="w-11/12" onSubmit={search}>
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
          <Listbox as="div" className="relative inline-block" value={searchType} onChange={setSearchType}>
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
                      <div className={clsxm("pl-8 py-1", active ? "bg-zinc-200" : "bg-white")}>
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
                      <div className={clsxm("pl-8 py-1", active ? "bg-zinc-200" : "bg-white")}>
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
                      <div className={clsxm("pl-8 py-1", active ? "bg-zinc-200" : "bg-white")}>
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
  );
};

export default SearchBar;
