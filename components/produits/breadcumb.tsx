import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Breadcumb = () => {
  return (
    <div className="flex  gap-4">
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
