"use client";
import Breadcumb from "@/components/produits/breadcumb";
import DishGrid from "@/components/produits/dishGrid";
import Head from "@/components/universal/Head";
import ProductQuery from "@/queries/productQuery";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
  const product = new ProductQuery();
  const productData = useQuery({
    queryKey: ["productFetchAll"],
    queryFn: () => product.getAllProducts(),
  });
  const categoryData = useQuery({
    queryKey: ["categoryFetchAll"],
    queryFn: () => product.getCategories(),
  });

  if (productData.isLoading && categoryData.isLoading) {
    return <div>Loading...</div>;
  }
  if (productData.isError && categoryData.isError) {
    return (
      <div>{productData.error?.message && categoryData.error?.message}</div>
    );
  }
  if (productData.isSuccess && categoryData.isSuccess) {
    return (
      <>
        {/* <Hero /> */}
        <Head image="/images/catalog.jpg" title="Tous nos Produits" />
        <div className=" pt-10 container mx-auto ">
          <Breadcumb />
          <DishGrid
            categories={categoryData.data.data}
            dishes={productData.data.data}
          />
        </div>
      </>
    );
  }
};

export default Page;
