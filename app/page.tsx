"use client";
import ProductGrid from "@/components/universal/ProductGrid";
import ProductQuery from "@/queries/productQuery";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const product = new ProductQuery();
  const productData = useQuery({
    queryKey: ["categoryFetchAll"],
    queryFn: () => product.getAllProducts(),
  });
  const categoryData = useQuery({
    queryKey: ["productFetchAll"],
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

        <div>
          <h2>Produit: </h2>
          <pre>{JSON.stringify(categoryData.data.data[0], null, 2)}</pre>
        </div>
        <div>
          <h2>Categories: </h2>
          <pre>{JSON.stringify(categoryData.data.data[0], null, 2)}</pre>
        </div>
      </>
    );
  }
}
