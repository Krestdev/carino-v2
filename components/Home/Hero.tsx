import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import SocialSidebar from "./SocialSideBar";

const Hero = () => {

  const router = useRouter();
  const randomImage = ["burger.webp", "pizza.webp", "salad.webp", "ramen.webp"];
  const randomIndex = Math.floor(Math.random() * randomImage.length);
  const selectedImage = randomImage[0];
  return (
    <div>
      <div
        style={{
          backgroundImage: "url('/categories/hero.webp')",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",

        }}
        className="relative flex flex-col gap-7 px-7 py-10 w-screen"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-primary/70 via-primary/80 to-primary/70" />

        <div className="mx-auto flex flex-col items-center gap-6 max-w-[768px] w-full z-10 md:mt-24">
          <div className="">
            <h1 className="text-center text-white uppercase">Bienvenue dans notre</h1>
            <h1 className="text-[#FFC336] text-center uppercase">pizzeria</h1>
          </div>
          <p className="text-[#FFFBF3] text-center w-[334px] md:w-[640px]">{"Pizzas, Burgers, Petits déjeuners, Plats avec sauce, Frites au plat, Bar, emporter, Catering Service. Découvrez un festin gourmet livré directement à votre porte."}</p>
          <div className="flex flex-col md:flex-row gap-4">
            <Button onClick={() => router.push("/reservation")} variant="accent" size={"lg"}>{"Réserver une table"}</Button>
            <Button onClick={() => router.push("/catalogue")} className="bg-white hover:bg-white/80 text-black" size={"lg"}>{"Commander un repas"}</Button>
          </div>
        </div>
        <div className="relative md:mt-8 w-full max-w-[768px] mx-auto h-auto aspect-768/209">
          <img src={`/${selectedImage}`} alt="burger" className="absolute md:-top-12" />
        </div>
        <SocialSidebar />
      </div>
    </div>
  );
};

export default Hero;
