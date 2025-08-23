import React from "react";

interface Props {
  image: string;
  title: string;
}

const Head = ({ image, title }: Props) => {
  return (
    <div
      style={{
         backgroundImage: `url("${image}")`,
         backgroundPosition: "center",
         backgroundSize: "cover",
         }}
      className="bg-cover bg-center w-full h-[300px] flex justify-center items-center"
    >
      <h1 className="text-white text-center">
        {title}
      </h1>
    </div>
  );
};

export default Head;
