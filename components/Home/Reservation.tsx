import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const Reservation = () => {
  return (
    <div
      style={{
        backgroundImage: `url('/images/reservation.webp')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="relative flex flex-col w-full h-[300px] md:h-[350px] lg:h-[550px] items-center justify-center"
    >
      <div className="absolute top-0 left-0 bg-black/60 w-full h-full" />
      <div className="z-10 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center">
          <h1 className="font-mono text-white text-center text-[32px] md:text-[48px] lg:text-[88px]">
            {"Réserver une table"}
          </h1>
          <h4 className="font-normal text-white text-center w-[570px]">
            {
              "Réservez votre table en ligne facilement et profitez d’une ambiance conviviale avec nos spécialités savoureuses, fraîcheur et service chaleureux."
            }
          </h4>
        </div>
        <Link href={"/reservation"}>
          <Button className="w-fit">{"Reserver une table"}</Button>
        </Link>
      </div>
    </div>
  );
};

export default Reservation;
