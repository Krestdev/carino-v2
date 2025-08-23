import React from "react";

interface Props {
  image: string;
  title?: string;
}

const Head = ({ image, title }: Props) => {
  return (
    <div
      style={{
         backgroundImage: `url("${image}")`,
         backgroundPosition: "center",
         backgroundSize: "cover",
         }}
      className="relative bg-cover bg-center w-full h-[300px] flex justify-center items-center"
    >
      <div className="absolute top-0 left-0 bg-black/60 w-full h-full"/>
      <h1 className="text-white text-center z-10">
        {title}
      </h1>
    </div>
  );
};

export default Head;
