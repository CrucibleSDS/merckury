import axios from "axios";

const ApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export enum SearchType {
  casNumber = "cas_number",
  productName = "product_name",
  productNumber = "product_number",
}

export type SafetyDataSheet = {
  id: number;
  product_name: string;
  product_brand: string;
  product_number: string;
  cas_number: string;
  pdf_download_url: string;
  data: any;
}

const searchSds = async (query: string, type: SearchType): Promise<SafetyDataSheet[]> => {
  const res = await ApiClient.get("sds/search", { params: { [type]: query } })
  return res.data as SafetyDataSheet[];
};

export { searchSds };
