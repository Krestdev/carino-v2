import React from "react";
import { Button } from "../ui/button";
import Othercategories from "./Othercategories";
import { Categories } from "@/types/types";

const Category = ({ categories }: { categories: Categories[] }) => {
  return (
    <div className="flex flex-wrap gap-4 gap pl-5 pt-2 w-full  ">
      <Button className="pt-3 pr-4 pb-3 pl-4 rounded-[27px] h-14 bg-white text-black  border-[1px] border-[#191537] ">
        {"Tous"}
      </Button>
      <Othercategories categories={categories} />
    </div>
  );
};

export default Category;
