import axios from "axios";
import { stringify } from "qs";
import fileDownload from "js-file-download";
import { customErrorFactory } from "ts-custom-error";

const ApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  paramsSerializer: {
    serialize: (params) => stringify(params, { indices: false }),
  },
});

const SearchClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SEARCH_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SEARCH_API_KEY}`,
  },
});

export type SafetyDataSheet = {
  id: number;
  product_name: string;
  product_brand: string;
  product_number: string;
  cas_number: string;
  hazards: string[];
  pdf_download_url: string;
  data: any;
};

export type SafetyDataSheetHit = {
  id: number;
  product_name: string;
  product_brand: string;
  product_number: string;
  cas_number: string;
  hazards: string[];
};

export type SafetyDataSheetSearchResult = {
  estimatedTotalHits: number;
  hits: SafetyDataSheetHit[];
  limit: number;
  offset: number;
  processingTimeMs: 0;
  query: string;
};

export type SafetyDataSheetUploadFailure = {
  file: File;
  statusCode?: number;
};

export const SafetyDataSheetUploadFailure = customErrorFactory(function (
  statusCode: number,
  file: File
) {
  this.statusCode = statusCode;
  this.file = file;
});

export type CheckoutItem = {
  sds_id: number;
  mass: number;
};

export const GenerationFailure = customErrorFactory(function (statusCode: number) {
  this.statusCode = statusCode;
  this.generationFailure = true;
});

const searchSds = async (
  q: string,
  limit: number,
  offset: number,
  signal?: AbortSignal
): Promise<SafetyDataSheetSearchResult | null> => {
  try {
    const res = await SearchClient.get("/", {
      params: { q, limit, offset },
      signal,
    });
    return res.data as SafetyDataSheetSearchResult;
  } catch (err) {
    if (axios.isCancel(err)) {
      return null;
    }
    throw err;
  }
};

const getBatchSds = async (
  sds_ids: number[],
  signal?: AbortSignal
): Promise<SafetyDataSheet[] | null> => {
  try {
    const res = await ApiClient.get("/sds/batch/", {
      params: { sds_ids },
      signal,
    });
    return res.data as SafetyDataSheet[];
  } catch (err) {
    if (axios.isCancel(err)) {
      return null;
    }
    throw err;
  }
};

const uploadSds = async (file: File): Promise<SafetyDataSheet> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await ApiClient.post("/sds/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data as SafetyDataSheet;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new SafetyDataSheetUploadFailure(err.response?.status, file);
    }
    throw err;
  }
};

const generateCoverSheet = async (items: CheckoutItem[]): Promise<void> => {
  try {
    const res = await ApiClient.post("/sds/checkout/", items, { responseType: "blob" });
    fileDownload(res.data, `cover_sheet_${Date.now()}.pdf`);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new GenerationFailure(err.response?.status);
    }
    throw err;
  }
};

export { getBatchSds, searchSds, uploadSds, generateCoverSheet };
