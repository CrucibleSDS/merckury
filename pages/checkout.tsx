import Layout from "@/components/Layout";
import { useSdsSelections } from "@/hooks/sdsSelection";
import { generateCoverSheet, getBatchSds, SafetyDataSheet } from "@/utils/api";
import { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";
import { Map } from "immutable";
import TextInput from "@/components/TextInput";
import clsxm from "@/utils/clsxm";
import ShoppingCartButton from "@/components/ShoppingCartButton";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const { sdsSelections } = useSdsSelections();
  const [sdses, setSdses] = useState<SafetyDataSheet[]>([]);
  const [masses, setMasses] = useState<Map<number, number>>(Map());
  const [totalMass, setTotalMass] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSdses = async () => {
      setIsLoading(true);
      const sds = await getBatchSds(sdsSelections);
      if (sds !== null) {
        setSdses(sds);
      }
      setIsLoading(false);
    };

    if (sdsSelections.length === 0) {
      setSdses([]);
    } else {
      fetchSdses();
    }
  }, [sdsSelections]);

  useEffect(() => {
    setTotalMass(
      masses.reduce((acc, m) => {
        if (isNaN(m)) {
          return acc;
        }
        return acc + m;
      }, 0)
    );
  }, [masses]);

  const generate = () =>
    toast.promise(
      generateCoverSheet(sdsSelections.map((id) => ({ sds_id: id, mass: masses.get(id, 0) }))),
      {
        pending: "Generating cover sheet..",
        success: "Successfully generated cover sheet!",
        error: {
          render({ data }: { data?: any }) {
            if (!!data?.generationFailure) {
              switch (data.statusCode) {
                case 422:
                  return "Invalid field values";
                default:
                  return "Unknown error occured";
              }
            }
            return "Unknown error occured";
          },
        },
      }
    );

  return (
    <>
      <ShoppingCartButton />
      <Layout title="Checkout" heading="SDS Cover Sheet Generation">
        {isLoading ? (
          <PropagateLoader color="#007a73" />
        ) : (
          <div className="w-full mb-8">
            {sdsSelections.length === 0 ? (
              <div className="flex justify-center items-center h-[72px]">
                No chemicals in cart :&#x28;
              </div>
            ) : (
              <>
                <ul className="mb-4">
                  {sdses.map((sds) => (
                    <li className="border-b border-b-merck-teal last:border-b-0 p-2" key={sds.id}>
                      <div className="w-[calc(70%-16px)] inline-block">
                        <div className="flex justify-between">
                          <a
                            href={sds.pdf_download_url}
                            target="_blank"
                            className="text-xl inline-block"
                            tabIndex={-1}
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
                        </div>
                      </div>
                      <div className="px-4 py-2 w-[calc(30%)] float-right border-l border-l-merck-teal">
                        <fieldset
                          className={clsxm(
                            "relative border w-[calc(65%-16px)] inline-block",
                            masses.get(sds.id, 0) === 0 || isNaN(masses.get(sds.id, 0))
                              ? "border-red-500"
                              : "border-merck-teal"
                          )}
                        >
                          <legend
                            className={clsxm(
                              "text-merck-teal text-left ml-1 -mb-3 px-1 pb-1",
                              masses.get(sds.id, 0) === 0 || isNaN(masses.get(sds.id, 0))
                                ? "text-red-500"
                                : "text-merck-teal"
                            )}
                          >
                            Mass <span className="text-[0.6rem] flex-grow">(g)</span>
                          </legend>
                          <TextInput
                            className="w-full pl-3 border-0 focus:ring-0 bg-transparent"
                            type="number"
                            step="any"
                            min={0}
                            value={masses.get(sds.id)}
                            onChange={(event) =>
                              setMasses((m) => m.set(sds.id, parseFloat(event.target.value)))
                            }
                          />
                        </fieldset>
                        <div
                          className={clsxm(
                            "ml-4 p-2 text-center w-[35%] leading-[1.1rem] border inline-block",
                            masses.get(sds.id, 0) === 0 || isNaN(masses.get(sds.id, 0))
                              ? "border-red-500"
                              : "border-merck-teal"
                          )}
                        >
                          {totalMass === 0
                            ? 0
                            : (
                                ((isNaN(masses.get(sds.id, 0)) ? 0 : masses.get(sds.id, 0)) /
                                  totalMass) *
                                100
                              ).toFixed(2)}
                          %
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-2 border-merck-teal p-2 space-y-2 text-center">
                  <p>
                    There {sdsSelections.length === 1 ? "is" : "are"}{" "}
                    <strong>
                      {sdsSelections.length} chemical{sdsSelections.length === 1 ? "" : "s"}
                    </strong>{" "}
                    in your cart.
                  </p>
                  <button
                    onClick={generate}
                    disabled={
                      !sdsSelections.every(
                        (sdsId) => !isNaN(masses.get(sdsId, 0)) && masses.get(sdsId, 0) > 0
                      )
                    }
                    className="block bg-merck-teal disabled:bg-neutral-300 disabled:text-neutral-500 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-400 text-white text-sm rounded px-1 py-1.5 w-full"
                  >
                    Generate cover sheet
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Layout>
    </>
  );
};

export default CheckoutPage;
