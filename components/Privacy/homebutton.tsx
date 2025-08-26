"use client"

import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Homebutton = () => {
  const router = useRouter();
  return (
    <Button onClick={() => router.push("/")} className="rounded-[27px] ml-3 pt-3 pr-4 pb-3 pl-4  mt-4">
      <ArrowLeft /> Retour à l'accueil
    </Button>
  );
};

export default Homebutton;
