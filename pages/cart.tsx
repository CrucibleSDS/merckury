import Layout from "@/components/Layout";
import { useSdsSelections } from "@/hooks/sdsSelection";
import { getBatchSds, SafetyDataSheet } from "@/utils/api";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";
import { PropagateLoader } from "react-spinners";

const CartPage = () => {
  const { sdsSelections, removeSdsSelections, clearSdsSelections } = useSdsSelections();
  const [sdses, setSdses] = useState<SafetyDataSheet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchSdses = async () => {
      setIsLoading(true);
      const sds = await getBatchSds(sdsSelections);
      if (sds !== null) {
        setSdses(sds);
      }
      setIsLoading(false);
      setInitialLoad(false);
    };

    if (sdsSelections.length === 0) {
      setSdses([]);
    } else {
      fetchSdses();
    }
  }, [sdsSelections]);

  return (
    <Layout title="Cart" heading="SDS Cart">
      {isLoading && initialLoad ? (
        <PropagateLoader color="#007a73" />
      ) : (
        <div className="space-x-4 w-full mb-8">
          <div className="border-2 border-merck-teal px-2 py-1 w-[calc(66%-16px)] inline-block">
            {sdsSelections.length === 0 ? (
              <div className="flex justify-center items-center h-[72px]">
                No chemicals in cart :&#x28;
              </div>
            ) : (
              <ul>
                {sdses.map((sds) => (
                  <li className="border-b border-b-merck-teal p-2" key={sds.id}>
                    <div className="flex justify-between">
                      <a
                        href={sds.pdf_download_url}
                        target="_blank"
                        className="text-xl inline-block"
                      >
                        {sds.product_name}
                        <span className="ml-1.5 text-xs flex-grow">({sds.id})</span>
                      </a>

                      <div className="flex-grow flex justify-end space-x-1">
                        {sds.hazards.map((hazard) => (
                          <img
                            src={`/assets/${hazard}.svg`}
                            alt={hazard}
                            className="w-7 h-7 inline-block"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-t-gray-300 mt-2 pt-2 text-sm">
                      <div className="inline-block space-x-2">
                        <span>
                          {sds.product_brand} {sds.product_number}
                        </span>
                        <span>&#x2022;</span>
                        <span>{sds.cas_number}</span>
                      </div>
                      <button
                        className="float-right text-xs px-0.5 py-0.5 -mt-0.5 text-red-500 hover:text-red-600 transition-colors duration-200"
                        onClick={() => removeSdsSelections(sds.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
                <div className="text-sm text-right mt-2 mb-1 mr-1">
                  <strong>
                    {sdsSelections.length} chemical{sdsSelections.length === 1 ? "" : "s"}
                  </strong>{" "}
                  in cart
                </div>
              </ul>
            )}
          </div>

          <div className="border-2 border-merck-teal p-2 w-[34%] float-right space-y-2 text-center">
            <p>
              There {sdsSelections.length === 1 ? "is" : "are"}{" "}
              <strong>
                {sdsSelections.length} chemical{sdsSelections.length === 1 ? "" : "s"}
              </strong>{" "}
              in your cart.
            </p>
            <Link
              href="/checkout"
              className="block bg-merck-teal text-white text-sm rounded px-1 py-1.5 w-full"
            >
              Proceed to checkout
            </Link>
            <hr className="border-neutral-300" />
            <button onClick={clearSdsSelections} className="bg-red-500 text-white text-sm rounded px-1 py-1.5 w-full">
              Clear cart
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CartPage;
