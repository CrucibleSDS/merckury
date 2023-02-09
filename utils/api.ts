import axios from "axios";
import { stringify } from "qs";
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
  pdf_download_url: string;
  data: any;
};

export type SafetyDataSheetHit = {
  id: number;
  product_name: string;
  product_brand: string;
  product_number: string;
  cas_number: string;
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

export { getBatchSds, searchSds, uploadSds };
