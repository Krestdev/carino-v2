import React from "react";
import { Button } from "../ui/button";
import { title } from "process";

const Othercategories = () => {
  return (
    <div className="flex gap-4">
      {[
        {
          title: "Les pizzas",
        },
        {
          title: "Les Burgers",
        },
        {
          title: "Les Pastas",
        },
        {
          title: "Les Boissons",
        },
        {
          title: "Les Salades",
        },
      ].map((value, i) => {
        return (
          <Button
            className="pt-3 pr-4 pb-3 pl-4 rounded-[27px] h-14 bg-white text-black  border-[1px] border-[#191537] "
            key={i}
          >
            {value.title}
          </Button>
        );
      })}
    </div>
  );
};

export default Othercategories;
