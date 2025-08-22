"use client";

//import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { config } from "../data/config";

function Footer() {
  const pathname = usePathname();
  const footerLinks: {
    mainTitle: string;
    content: { title: string; link: string }[];
  }[] = [
    {
      mainTitle: "liens rapides",
      content: [
        {
          title: "plats à la carte",
          link: "/plats",
        },
        {
          title: "carte menu",
          link: "/telechargement/catalogue.pdf",
        },
        {
          title: "panier",
          link: "/cart",
        },
        {
          title: "catalogue",
          link: "/catalogue",
        },
      ],
    },
    {
      mainTitle: "contact",
      content: [
        {
          title: "info@le-carino.com",
          link: "mailto:info@le-carino.com",
        },
        {
          title: "+237 696 54 10 55",
          link: "tel:+237696541055",
        },
      ],
    },
    {
      mainTitle: "aide & ressources",
      content: [
        {
          title: "politique & confidentialité",
          link: "/privacy",
        },
        {
          title: "termes et conditions",
          link: "/termes-conditions",
        },
        {
          title: "aide",
          link: "/aide",
        },
      ],
    },
  ];

  if (pathname === "/maintenance") {
    return null;
  }

  return (
    <footer className="py-8 sm:pt-12 md:pt-14 lg:py-16 xl:pt-20 bg-primary gap-8 md:gap-0 dark:bg-dot-white/[0.1] bg-dot-white/[0.1] relative">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-primary [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="container max-w-[1417px] w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-sm gap-8 md:gap-0">
        <div className="flex flex-col px-7 md:items-center">
          <div className="flex flex-col gap-2 md:gap-4">
            <img src="/LogoWhite.svg" alt="logo" width={100} height={100} />
            <p className="text-slate-400">{config.contact.address}</p>
            <ul className="flex gap-3 text-slate-400">
              <li>
                <a href="https://wa.me/message/YNEYUIM7RG3ZO1" target="_blank">
                  <FaWhatsapp size={20} className="footerLink" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/LeCarinoPizzeria"
                  target="_blank"
                >
                  <FaFacebook size={20} className="footerLink" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/le_carino_pizzeria/"
                  target="_blank"
                >
                  <FaInstagram size={20} className="footerLink" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        {footerLinks.map((linkItem, id) => (
          <div className="flex flex-col gap-4 px-7 md:items-center" key={id}>
            <ul className="flex flex-col gap-1">
              <h4 className="font-semibold text-white capitalize">
                {linkItem.mainTitle}
              </h4>
              {linkItem.content.map((item, index) => (
                <li
                  key={index}
                  className="first-letter:uppercase text-slate-400"
                >
                  <Link href={item.link} className="footerLink">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container mx-auto flex flex-col px-7 md:items-center xl:flex-row text-sm mt-12 gap-3">
        <div className="flex flex-col md:items-center justify-center gap-2 w-full">
          <p className="text-slate-400 md:text-center">@ 2024 le Carino.</p>
          <p className="text-[#A3A0B9] md:text-center">
            Designé et implementé par
            <Link className="text-[#F4F4F7]" href={"https://www.krestdev.com/"}>
              {" "}
              KRESTDEV
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
