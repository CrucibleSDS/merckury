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
import Checkbox from "@/components/Checkbox";
import { capitalize, parseDate } from "../utils";

const CheckoutPage = () => {
  const { sdsSelections } = useSdsSelections();
  const [productName, setProductName] = useState("");
  const [destination, setDestination] = useState("");
  const [measurementType, setMeasurementType] = useState<
    "volume" | "weight" | null
  >(null);
  const [certDate, setCertDate] = useState<Date | null>(null);
  const [sensitivity, setSensitivity] = useState<
    "sensitive" | "confidential" | "proprietary" | "public" | null
  >(null);
  const [sdses, setSdses] = useState<SafetyDataSheet[]>([]);
  const [percentages, setPercentages] = useState<Map<number, number>>(Map());
  const [totalPercentage, setTotalPercentage] = useState(0);
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
    setTotalPercentage(
      percentages.reduce((acc, m) => {
        if (isNaN(m)) {
          return acc;
        }
        return acc + m;
      }, 0)
    );
  }, [percentages]);

  const generate = () => {
    if (
      !sdsSelections.every(
        (sdsId) =>
          !isNaN(percentages.get(sdsId, 0)) &&
          percentages.get(sdsId, 0) > 0 &&
          percentages.get(sdsId, 0) <= 100
      ) ||
      totalPercentage != 100 ||
      productName.length === 0 ||
      destination.length === 0 ||
      measurementType === null ||
      sensitivity === null ||
      certDate === null
    ) {
      return;
    }

    toast.promise(
      generateCoverSheet(
        productName,
        destination,
        measurementType,
        certDate.toLocaleDateString("fr-CA"),
        sensitivity,
        sdsSelections.map((id) => ({
          sds_id: id,
          percentage: percentages.get(id, 0),
        }))
      ),
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
  };

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
                <div className="border-y-2 border-merck-teal mb-4 py-4 px-2 space-y-4">
                  <div className="space-x-4">
                    <fieldset
                      className={clsxm(
                        "relative border w-[calc(50%-8px)] inline-block",
                        productName.length === 0
                          ? "border-red-500"
                          : "border-merck-teal"
                      )}
                    >
                      <legend
                        className={clsxm(
                          "text-merck-teal text-left ml-1 -mb-3 px-1 pb-1",
                          productName.length === 0
                            ? "text-red-500"
                            : "text-merck-teal"
                        )}
                      >
                        Product Name
                      </legend>
                      <TextInput
                        required
                        className="w-full px-3 border-0 focus:ring-0 bg-transparent"
                        type="text"
                        placeholder="..."
                        value={productName}
                        onChange={(event) => setProductName(event.target.value)}
                      />
                    </fieldset>
                    <fieldset
                      className={clsxm(
                        "relative border w-[calc(50%-8px)] inline-block",
                        destination.length === 0
                          ? "border-red-500"
                          : "border-merck-teal"
                      )}
                    >
                      <legend
                        className={clsxm(
                          "text-merck-teal text-left ml-1 -mb-3 px-1 pb-1",
                          destination.length === 0
                            ? "text-red-500"
                            : "text-merck-teal"
                        )}
                      >
                        Shipment Destination
                      </legend>
                      <TextInput
                        required
                        className="w-full px-3 border-0 focus:ring-0 bg-transparent"
                        type="text"
                        placeholder="..."
                        value={destination}
                        onChange={(event) => setDestination(event.target.value)}
                      />
                    </fieldset>
                  </div>
                  <div className="space-x-4">
                    <fieldset
                      className={clsxm(
                        "relative border w-[calc(33%-8px)] inline-block align-top",
                        measurementType === null
                          ? "border-red-500"
                          : "border-merck-teal"
                      )}
                    >
                      <legend
                        className={clsxm(
                          "text-merck-teal text-left ml-1 -mb-3 px-1 pb-1",
                          measurementType === null
                            ? "text-red-500"
                            : "text-merck-teal"
                        )}
                      >
                        Measurement Type
                      </legend>
                      <div className="w-full px-4 py-2">
                        <div className="flex items-center">
                          <Checkbox
                            type="radio"
                            name="measurementType"
                            className="my-2 mr-2 w-6 h-6"
                            value="volume"
                            checked={measurementType === "volume"}
                            onChange={(event) => setMeasurementType("volume")}
                          />{" "}
                          % by volume
                        </div>
                        <div className="flex items-center">
                          <Checkbox
                            type="radio"
                            name="measurementType"
                            className="my-2 mr-2 w-6 h-6"
                            value="weight"
                            checked={measurementType === "weight"}
                            onChange={(event) => setMeasurementType("weight")}
                          />{" "}
                          % by weight
                        </div>
                      </div>
                    </fieldset>
                    <fieldset
                      className={clsxm(
                        "relative border w-[calc(33%-8px)] inline-block align-top",
                        sensitivity === null
                          ? "border-red-500"
                          : "border-merck-teal"
                      )}
                    >
                      <legend
                        className={clsxm(
                          "text-merck-teal text-left ml-1 -mb-3 px-1 pb-1",
                          sensitivity === null
                            ? "text-red-500"
                            : "text-merck-teal"
                        )}
                      >
                        Sensitivity Label
                      </legend>
                      <div className="flex w-full px-4 py-2">
                        <div className="w-1/2 mr-4">
                          <div className="flex items-center">
                            <Checkbox
                              type="radio"
                              name="sensitivity"
                              className="my-2 mr-2 w-6 h-6"
                              value="sensitive"
                              checked={sensitivity === "sensitive"}
                              onChange={(event) => setSensitivity("sensitive")}
                            />{" "}
                            Sensitive
                          </div>
                          <div className="flex items-center">
                            <Checkbox
                              type="radio"
                              name="sensitivity"
                              className="my-2 mr-2 w-6 h-6"
                              value="confidential"
                              checked={sensitivity === "confidential"}
                              onChange={(event) =>
                                setSensitivity("confidential")
                              }
                            />{" "}
                            Confidential
                          </div>
                          <div className="flex items-center">
                            <Checkbox
                              type="radio"
                              name="sensitivity"
                              className="my-2 mr-2 w-6 h-6"
                              value="proprietary"
                              checked={sensitivity === "proprietary"}
                              onChange={(event) =>
                                setSensitivity("proprietary")
                              }
                            />{" "}
                            Proprietary
                          </div>
                          <div className="flex items-center">
                            <Checkbox
                              type="radio"
                              name="sensitivity"
                              className="my-2 mr-2 w-6 h-6"
                              value="public"
                              checked={sensitivity === "public"}
                              onChange={(event) => setSensitivity("public")}
                            />{" "}
                            Public
                          </div>
                        </div>
                        <div className="w-1/2 pl-4 border-l border-neutral-300 flex justify-center items-center">
                          {sensitivity !== null ? (
                            <img
                              className="w-20 h-20"
                              src={`/assets/${sensitivity}.svg`}
                              alt={sensitivity}
                            />
                          ) : null}
                        </div>
                      </div>
                    </fieldset>
                    <fieldset
                      className={clsxm(
                        "relative border w-[calc(33%-8px)] inline-block align-top",
                        certDate === null
                          ? "border-red-500"
                          : "border-merck-teal"
                      )}
                    >
                      <legend
                        className={clsxm(
                          "text-merck-teal text-left ml-1 -mb-3 px-1 pb-1",
                          certDate === null ? "text-red-500" : "text-merck-teal"
                        )}
                      >
                        Certification Date
                      </legend>
                      <div className="w-full px-4 py-2">
                        <TextInput
                          required
                          className="w-full border-0 focus:ring-0 bg-transparent text-md"
                          type="date"
                          pattern="\d{4}-\d{2}-\d{2}"
                          onChange={(event) =>
                            setCertDate(parseDate(event.target.value))
                          }
                          value={certDate?.toLocaleDateString("fr-CA")}
                        />
                      </div>
                    </fieldset>
                  </div>
                </div>
                <ul className="pb-4 border-b-2 border-b-merck-teal">
                  {sdses.map((sds) => (
                    <li
                      className="border-b border-b-merck-teal last:border-b-0 p-2"
                      key={sds.id}
                    >
                      <div className="w-[calc(80%-16px)] inline-block">
                        <div className="flex justify-between">
                          <a
                            href={sds.pdf_download_url}
                            target="_blank"
                            className="text-xl inline-block"
                            tabIndex={-1}
                          >
                            {sds.product_name}
                            <span className="ml-1.5 text-xs flex-grow">
                              ({sds.id})
                            </span>
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
                      <div className="px-4 py-2 w-[20%] float-right border-l border-l-merck-teal">
                        <fieldset
                          className={clsxm(
                            "relative border w-full",
                            percentages.get(sds.id, 0) <= 0 ||
                              percentages.get(sds.id, 0) > 100 ||
                              isNaN(percentages.get(sds.id, 0))
                              ? "border-red-500"
                              : "border-merck-teal"
                          )}
                        >
                          <legend
                            className={clsxm(
                              "text-merck-teal text-left ml-1 -mb-3 px-1 pb-1",
                              percentages.get(sds.id, 0) <= 0 ||
                                percentages.get(sds.id, 0) > 100 ||
                                isNaN(percentages.get(sds.id, 0))
                                ? "text-red-500"
                                : "text-merck-teal"
                            )}
                          >
                            {capitalize(measurementType ?? "unit")}{" "}
                            <span className="text-[0.75rem] flex-grow">
                              (%)
                            </span>
                          </legend>
                          <TextInput
                            required
                            className="w-full pl-3 border-0 focus:ring-0 bg-transparent"
                            type="number"
                            step="1"
                            min={0}
                            max={100}
                            placeholder="..."
                            value={percentages.get(sds.id)}
                            onChange={(event) =>
                              setPercentages((m) =>
                                m.set(sds.id, parseFloat(event.target.value))
                              )
                            }
                          />
                        </fieldset>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="text-right mt-2 mb-8 px-4 text-sm">
                  Total percentage:{" "}
                  <span className="w-12 text-right inline-block font-bold">
                    {totalPercentage > 100
                      ? ">"
                      : totalPercentage < 0
                      ? "<"
                      : ""}
                    {Math.min(Math.max(totalPercentage, 0), 100)}%
                  </span>
                </div>
                <div className="border-2 border-merck-teal p-2 space-y-2 text-center">
                  <p>
                    There {sdsSelections.length === 1 ? "is" : "are"}{" "}
                    <strong>
                      {sdsSelections.length} chemical
                      {sdsSelections.length === 1 ? "" : "s"}
                    </strong>{" "}
                    in your cart.
                  </p>
                  <button
                    onClick={generate}
                    disabled={
                      !sdsSelections.every(
                        (sdsId) =>
                          !isNaN(percentages.get(sdsId, 0)) &&
                          percentages.get(sdsId, 0) > 0 &&
                          percentages.get(sdsId, 0) <= 100
                      ) ||
                      totalPercentage != 100 ||
                      productName.length === 0 ||
                      destination.length === 0 ||
                      measurementType === null ||
                      sensitivity === null ||
                      certDate === null
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
