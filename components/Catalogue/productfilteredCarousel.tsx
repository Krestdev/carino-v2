import { Categories, ProductsData } from "@/types/types";
import ProductCarousel from "../universal/ProductCarousel";
import CatProdMob from "../universal/CatProdMob";
type Props = {
  product: ProductsData[];
  categories: Categories[];
};

const ProductfilteredCarousel = ({ product, categories }: Props) => {
  const categoryList = categories.filter(
    (x: Categories) => x.id_parent === null
  );
  return (
    <>
      {categoryList.map((category, i: number) => {
        const isLeft = i % 2 === 0;
        return (
          <>
            <ProductCarousel
              key={i}
              products={product.filter((product) =>
                product.cat.some(
                  (x) => x.id === category.id || x.id_parent === category.id
                )
              )}
              category={category}
              isLeft={isLeft}
            />
            <CatProdMob
              products={product.filter((product) =>
                product.cat.some(
                  (x) => x.id === category.id || x.id_parent === category.id
                )
              )}
              category={category}
            />
          </>
        );
      })}
    </>
  );
};

export default ProductfilteredCarousel;
