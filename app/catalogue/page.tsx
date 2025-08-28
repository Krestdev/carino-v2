"use client";
import Cataloguebreadcumb from "@/components/Catalogue/cataloguebreadcumb";
import ProductfilteredCarousel from "@/components/Catalogue/productfilteredCarousel";
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
    return (
      <div className=" h-[50vh] flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }
  if (productData.isError && categoryData.isError) {
    return (
      <div className=" h-[50vh] flex justify-center items-center">
        <p>Fetch not Successful</p>
      </div>
    );
  }
  if (productData.isSuccess && categoryData.isSuccess) {
    return (
      <>
        {/* <CatalogueHero /> */}
        <Head image="/images/catalog.jpg" title="Catalogue" />
        <div className="container mx-auto flex flex-col gap-4 ">
          <Cataloguebreadcumb />
          <h3>Catalogue</h3>

          <ProductfilteredCarousel
            product={productData.data.data}
            categories={categoryData.data.data}
          />
        </div>
      </>
    );
  }
};

export default Page;
