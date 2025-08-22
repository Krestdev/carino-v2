import { ChevronRight } from "lucide-react";
import React from "react";
import Link from "next/link";

const Cataloguebreadcumb = () => {
  return (
    <div className="flex gap-2 border-b-[1px]  border-b-[#D9D9D9] pt-3 pr-5 pb-3 pl-5 ">
      <p className="text-orange-300">
        <Link href="/">Home</Link>
      </p>
      <ChevronRight />
      <p>Catalogue</p>
    </div>
  );
};

export default Cataloguebreadcumb;
