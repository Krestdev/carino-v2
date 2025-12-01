import { ChevronRight } from "lucide-react";
import React from "react";
import Link from "next/link";

const Cataloguebreadcumb = () => {
  return (
    <div className="flex gap-2 pt-3 pr-5 pb-3 pl-5 items-center">
      <p className="text-accent">
        <Link href="/">{"Accueil"}</Link>
      </p>
      <ChevronRight size={16}/>
      <p>{"Catalogue"}</p>
    </div>
  );
};

export default Cataloguebreadcumb;
