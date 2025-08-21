import React from "react";
import { Button } from "../ui/button";
import Othercategories from "./Othercategories";

const Categories = () => {
  return (
    <div className="flex  gap-4">
      <Button className="pt-3 pr-4 pb-3 pl-4 rounded-[27px] h-14  ">
        {"Tous"}
      </Button>
      <Othercategories />
    </div>
  );
};

export default Categories;
