import React from "react";
import { Button } from "../ui/button";
import { title } from "process";
import { Categories } from "@/types/types";

const Othercategories = ({ categories }: { categories: Categories[] }) => {
  return (
    <>
      {categories.map((value, i) => {
        return (
          <Button
            className="pt-3 pr-4 pb-3 pl-4 rounded-[27px] h-14 bg-white text-black  border-[1px] border-[#191537] "
            key={i}
          >
            {value.name}
          </Button>
        );
      })}
    </>
  );
};

export default Othercategories;
