import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Breadcumb = () => {
  return (
    <div className="flex  gap-2 border-b-[1px] border-b-[#D9D9D9]  pt-4 pr-5 pb-4 pl-5 ">
      <p className="text-orange-300">
        {" "}
        <Link href="/">Home</Link>{" "}
      </p>
      <ChevronRight />
      <p>Tous nos produits</p>
    </div>
  );
};

export default Breadcumb;
