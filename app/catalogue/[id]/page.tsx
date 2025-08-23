import ProductQuery from "@/queries/productQuery";
import { Categories } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import Category from "./Category";

type Props = {
  params: Promise<{
    id: number;
  }>;
};

const Categorydetail = async ({ params }: Props) => {
  const id = (await params).id;

  return <Category id={id} />;
};

export default Categorydetail;
