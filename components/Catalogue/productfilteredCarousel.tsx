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
  const importantCat = ["suggestions du chef", "vacances"];
  //filter important categories to be shown first
  categoryList.sort((a, b) => {
    if (
      importantCat.includes(a.name.trim().toLocaleLowerCase()) &&
      !importantCat.includes(b.name.trim().toLocaleLowerCase())
    ) {
      return -1;
    }
    if (
      !importantCat.includes(a.name.trim().toLocaleLowerCase()) &&
      importantCat.includes(b.name.trim().toLocaleLowerCase())
    ) {
      return 1;
    }
    return 0;
  });
  return (
    <>
      {categoryList.map((category, i: number) => {
        const isLeft = i % 2 === 0;
        return (
          <div key={i}>
            <ProductCarousel
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
          </div>
        );
      })}
    </>
  );
};

export default ProductfilteredCarousel;
