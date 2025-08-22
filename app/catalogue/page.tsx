"use client";
import Cataloguebreadcumb from "@/components/Catalogue/cataloguebreadcumb";
import CatalogueHero from "@/components/Catalogue/catalogueHero";
import ProductfilteredCarousel from "@/components/Catalogue/productfilteredCarousel";
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
  console.log(categoryData.data, productData.data, categoryData.isSuccess);
  if (productData.isSuccess && categoryData.isSuccess) {
    return (
      <>
        <CatalogueHero />
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
