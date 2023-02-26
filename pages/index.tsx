import type { NextPage } from "next";
import SearchBar from "@/components/SearchBar";
import ShoppingCartButton from "@/components/ShoppingCartButton";
import Layout from "@/components/Layout";

const Home: NextPage = () => (
  <>
    <ShoppingCartButton />
    <Layout heading="SDS Search">
      <SearchBar />
    </Layout>
  </>
);

export default Home;
