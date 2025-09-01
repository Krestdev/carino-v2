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
    <div className="flex flex-wrap gap-4 gap pl-5 pt-2 w-full  ">
      <Button
        onClick={() => {
          handleFilter(-1);
          setSelected(-1);
        }}
        className={`pt-3 pr-4 pb-3 pl-4 rounded-[27px] h-10 hover:text-white ${selected === -1 ? "bg-black text-white" : "bg-white text-black"
          }  border-[1px] border-[#191537] `}
      >
        {"Tous"}
      </Button>
      {categories.map((value, i) => {
        return (
          <Button
            className={`pt-3 pr-4 pb-3 pl-4 rounded-[27px] h-10 hover:text-white  ${selected === value.id
                ? "bg-black text-white"
                : "bg-white text-black"
              }  border-[1px] border-[#191537] `}
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
