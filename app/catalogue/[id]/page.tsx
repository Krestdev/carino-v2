import React from "react";
import Category from "./Category";

type Props = {
  params: Promise<{
    id: number;
  }>;
};

const Categorydetail = async ({ params }: Props) => {
  const id = (await params).id;

  return <CategoryDetail id={id} />;
};

export default Categorydetail;
