import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  image: string;
  title?: string;
  subTitle: string
  /** Mobile : hero réduit au plus près du texte */
  compact?: boolean
}

const Head = ({ image, title, subTitle, compact }: Props) => {
  return (
    <div
      style={{
        backgroundImage: `url("${image}")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className={cn(
        "flex relative bg-cover bg-center w-full justify-center items-center px-2.5 py-7 md:py-16 gap-6",
        compact && "py-4"
      )}
    >
      <div className="absolute top-0 left-0 bg-primary/80 w-full h-full" />
      <div className="flex flex-col items-center justify-center gap-1 z-10">
        <h4 className="text-[14px] text-center uppercase text-[#FFC336]">{subTitle}</h4>
        <h2 className="text-white text-center">
          {title}
        </h2>
      </div>
    </div>
  );
};

export default Head;
