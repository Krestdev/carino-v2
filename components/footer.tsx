"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function Footer() {
  const pathname = usePathname();
  const infos = [
    {
      id: 0,
      img: "/map.png",
      title: "Carrefour PlaYce, Yaoundé Cameroun",
      link: "",
    },
    {
      id: 1,
      img: "/phone.png",
      title: "+237 696 54 10 55",
      link: "tel:+237696541055",
    },
    {
      id: 2,
      img: "/mail.png",
      title: "info@le-carino.com",
      link: "mailto:info@le-carino.com",
    },
  ]

  if (pathname === "/maintenance") {
    return null;
  }

  return (
    <footer className="pt-10 flex flex-col gap-6 px-7 bg-[#FFFBF3] w-full">
      <div className="max-w-[1024px] w-full grid grid-cols-1 md:grid-cols-3 gap-12 h-fit mx-auto">
        {infos.map((info, ind) => (
          <Link key={ind} href={info.link} className="flex flex-row gap-3 items-center justify-center">
            <img src={info.img} alt={info.title} height={48} width={48} className="w-[34px] h-[34px] md:w-[34px] md:h-[34px]" />
            <span className="text-base font-semibold w-[158px]">{info.title}</span>
          </Link>
        ))}
      </div>
      <div className="max-w-[1024px] w-full mx-auto flex flex-row items-center justify-between py-3 border-t border-[#E5E7EB]">
        <p className="text-base">{`© 2026 Le Carino Pizzéria. `}<Link target="_blank" className="hover:text-blue-500" href={"https://krestdev.com/"}>{"Développé par KrestDev"}</Link></p>
        <div className="flex flex-row gap-2">
          <Link className="flex items-center justify-center px-3 py-1 gap-2 h-10 hover:bg-[#F3F4F6]" href={"/privacy"}>{"Confidentialité"}</Link>
          <Link className="flex items-center justify-center px-3 py-1 gap-2 h-10 hover:bg-[#F3F4F6]" href={"/terms"}>{"Termes & conditions"}</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
