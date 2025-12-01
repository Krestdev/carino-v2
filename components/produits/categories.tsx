import { Categories } from "@/types/types";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
interface Props {
  categories: Categories[];
  handleFilter(id: number): void;
}

const Category = ({ categories, handleFilter }: Props) => {

  useEffect(() => {
    handleFilter(-1);
  }, [])

  const [selected, setSelected] = useState(-1);
  return (
    <div className="flex flex-wrap gap-2 gap pl-5 pt-2 w-full  ">
      <Button
        onClick={() => {
          handleFilter(-1);
          setSelected(-1);
        }}
        className={`pt-3 pr-4 pb-3 pl-4 rounded-full hover:bg-accent/20 h-10 ${selected === -1 ? "bg-primary text-primary-foreground hover:bg-primary/80" : "bg-white text-black"
          }  border border-primary/20`}
      >
        {"Tous"}
      </Button>
      {categories.map((value, i) => {
        return (
          <Button
            className={`pt-3 pr-4 pb-3 pl-4 rounded-full hover:bg-accent/20 h-10  ${selected === value.id
                ? "bg-primary text-primary-foreground hover:bg-primary/80"
                : "bg-white text-primary"
              }  border border-primary/20 `}
            key={i}
            onClick={() => {
              handleFilter(value.id);
              setSelected(value.id);
            }}
          >
            {value.name}
          </Button>
        );
      })}
    </div>
  );
};

export default Category;
