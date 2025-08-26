import { config } from "@/data/config";
import React from "react";
import { Button } from "../ui/button";
import PromoMessage from "../universal/PromoMessage";

const Hero = () => {
  const message =
    "Pour 2 pizzas🍕🍕 achetées, 1 pizza🍕 offerte ! Profitez-en du 10 juillet au 05 Septembre 2025 exclusivement sur notre site.";
  return (
    <div
      style={{
        backgroundImage: "url('/images/hero.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="relative pt-[calc(60px+48px)] pb-[calc(80px+48px)] sm:pt-[calc(60px+72px)] sm:pb-[calc(80px+72px)] md:py-0 md:h-screen overflow-hidden flex items-center w-screen"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b md:bg-gradient-to-r from-[#191537] from-30% md:from-42% to-transparent to-100%" />

      <div className="px-0 lg:px-24 z-10">
        <div className="flex flex-col gap-4 px-8 w-fit">
          <div className="flex flex-col ">
            <h1 className="text-white uppercase w-fit">{config.siteName}</h1>
            <p className="text-[#FFC336] uppercase text-[14px] md:text-[24px] w-fit tracking-[0.18em] md:tracking-[0.25em] lg:tracking-[0.50em]">
              {config.slogan}
            </p>
          </div>
          <div className="flex flex-col gap-8">
            <p className="text-white text-[14px] w-[320px] md:text-[24px] md:w-[700px] leading-[150%]">
              {config.description}
            </p>
            <div className="flex flex-row gap-2">
              <Button className="bg-[#29235C]">{"Commander"}</Button>
              <Button variant={"outline"}>{"Réserver une Table"}</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0">
        <PromoMessage
          start={new Date()}
          end={new Date(2025, 8, 5)}
          message={message}
        />
      </div>
    </div>
  );
};

export default Hero;
