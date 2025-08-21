"use client";
import CatProdMob from "@/components/universal/CatProdMob";
import ProductCarousel from "@/components/universal/ProductCarousel";
import ProductGrid from "@/components/universal/ProductGrid";
import ProductQuery from "@/queries/productQuery";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const product = new ProductQuery();
  const productData = useQuery({
    queryKey: ["productFetchAll"],
    queryFn: () => product.getAllProducts(),
  });
  const categoryData = useQuery({
    queryKey: ["productFetchAll"],
    queryFn: () => product.getAllProducts(),
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
        <div>
          <h1>Je suis un titre h1</h1>
          <h2>Je suis un titre h2</h2>
          <h3>Je suis un titre h3</h3>
          <h4>Je suis un titre h4</h4>
          <p>Je suis un paragraphe</p>
        </div>

        <ProductGrid
          products={productData.data.data}
          category={categoryData.data.data[0]}
          isCategory={true}
        />

        <CatProdMob products={productData.data.data} category={categoryData.data.data[0]} />
      </>
    );
  }
}
