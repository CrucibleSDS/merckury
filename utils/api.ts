import axios, { AxiosError } from "axios";

const ApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
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

const searchSds = async (
  query: string,
  signal?: AbortSignal
): Promise<SafetyDataSheet[] | null> => {
  try {
    const res = await ApiClient.get("sds/search", { params: { query }, signal });
    return res.data as SafetyDataSheet[];
  } catch (err) {
    if (axios.isCancel(err)) {
      return null;
    }
    throw err;
  }
};

export { searchSds };
