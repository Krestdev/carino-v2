"use client";

import ProductGrid from "@/components/universal/ProductGrid";
import { useCategories } from "@/hooks/useCategory";
import { useProducts } from "@/hooks/useProducts";
import Image from "next/image";

export default function Home() {
  const { data: productData, isSuccess: productIsSuccess, isLoading: productIsLoading, isError: productIsError, error: productError } = useProducts();
  const {data: categoryData, isSuccess: categoryIsSucces, isLoading: categoryIsLoading, isError: categoryIsError, error: categoryError } = useCategories()

  if (productIsLoading || categoryIsLoading) {
    return <div>Loading...</div>;
  }
  if (productIsError || categoryIsError) {
    return <div>{productError?.message || categoryError?.message}</div>;
  }
  if (productIsSuccess && categoryIsSucces) {
    return (
      <>
        <div>
          <h1>Je suis un titre h1</h1>
          <h2>Je suis un titre h2</h2>
          <h3>Je suis un titre h3</h3>
          <h4>Je suis un titre h4</h4>
          <p>Je suis un paragraphe</p>
        </div>

        <ProductGrid products={productData.data.data} category={categoryData.data.data[0]} isCategory={true} />

        <div>
          <h2>Produit: </h2>
          <pre>
            {JSON.stringify(productData.data.data[0], null, 2)}
          </pre>
        </div>
        <div>
          <h2>Categories: </h2>
          <pre>
            {JSON.stringify(categoryData.data.data[0], null, 2)}
          </pre>
        </div>
      </>
    );
  }
}
