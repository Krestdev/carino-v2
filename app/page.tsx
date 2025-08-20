"use client";
import ProductQuery from "@/queries/productQuery";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

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

        <div>
          <h2>Produit: </h2>
          <pre>{JSON.stringify(productData.data.data[0], null, 2)}</pre>
        </div>
        <div>
          <h2>Categories: </h2>
          <pre>{JSON.stringify(categoryData.data.data[0], null, 2)}</pre>
        </div>
      </>
    );
  }
}
