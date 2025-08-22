import React from "react";
import { Button } from "../ui/button";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";

const Homebutton = () => {
  return (
    <Button className="rounded-[27px] ml-3 pt-3 pr-4 pb-3 pl-4  mt-4">
      <ArrowLeft /> Retour à l'accueil
    </Button>
  );
};

export default Homebutton;
