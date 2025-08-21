"use client";
import Hero from "@/components/Home/Hero";
import CatProdMob from "@/components/universal/CatProdMob";
import ProductCarousel from "@/components/universal/ProductCarousel";
import ProductQuery from "@/queries/productQuery";
import { Categories, ProductData } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
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

    const dailyMenu: ProductData[] = productData.data.data
      .filter((product: { cat: ProductData[]; }) =>
        product.cat.some(
          (element) =>
            element.name.toLocaleLowerCase().includes("suggestion") || element.name.toLocaleLowerCase() === "suggestions du chef"
        )
      );
    const dailyCategory = categoryData.data.data.find((category: Categories) => category.id === dailyMenu[0].cat[0].id);
    
    return (
      <div>
        <Hero />
        <div className="pt-6">
          <ProductCarousel
            products={dailyMenu}
            category={dailyCategory}
          />
        </div>

        <CatProdMob products={dailyMenu} category={dailyCategory} />
      </div>
    );
  }
}
