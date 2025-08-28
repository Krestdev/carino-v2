import { cartItem } from "@/types/types";

export function ApplyPromotion(data: cartItem[]): cartItem[] {
  // console.log("en cours");

  const today = new Date();
  const startDate = new Date(today.getFullYear(), 6, 10);
  const endDate = new Date(today.getFullYear(), 8, 5);

  const includedCategoryIds = [403441, 403438, 406718, 403440];

  if (today >= startDate && today <= endDate) {
    const eligibleItems = data.filter((item) =>
      item.cat.some((cat) => includedCategoryIds.includes(cat.id))
    );

    const freePizza = Math.floor(
      eligibleItems.reduce((acc, item) => acc + item.qte, 0) / 2
    );

    if (freePizza === 0) return data;

    return [
      ...data,
      {
        id: "1745383",
        qte: freePizza,
        nom: "NAPOLETANA",
        itemId: 1739530998442,
        options: [],
        price: 0,
        image: "https://media.zelty.fr/images/2221/6100/5bd21.jpg",
        cat: [
          {
            name: "Les Classiques Indémodables",
            id: 403441,
            // id_zelty: "6100",
            id_parent: 253199,
          },
        ],
      },
    ];
  }

  return data;
}

export function SendWithPromotion(data: cartItem[]): cartItem[] {
  const result = [...data];
  const today = new Date();
  const startDate = new Date(today.getFullYear(), 6, 10);
  const endDate = new Date(today.getFullYear(), 8, 5);

  const includedCategoryIds = [403441, 403438, 406718, 403440];

  if (today >= startDate && today <= endDate) {
    const eligibleItems = data.filter((item) =>
      item.cat.some((cat) => includedCategoryIds.includes(cat.id))
    );

    const freePizza = Math.floor(
      eligibleItems.reduce((acc, item) => acc + item.qte, 0) / 2
    );

    if (freePizza === 0) return result;

    const pizzaArray = Array.from({ length: freePizza }, () => ({
      id: "1745383",
      qte: 1,
      nom: "NAPOLETANA",
      itemId: 1739530998442,
      options: [],
      price: 0,
      image: "https://media.zelty.fr/images/2221/6100/5bd21.jpg",
      cat: [
        {
          name: "Les Classiques Indémodables",
          id: 403441,
          id_zelty: "6100",
          id_parent: 253199,
        },
      ],
    }));

    return [...result, ...pizzaArray];
  }

  return result;
}

export function deliveryPromotion(
  data: cartItem[],
  fees: number,
  address: string
): number {
  const today = new Date();
  const startDate = new Date(today.getFullYear(), 6, 10);
  const endDate = new Date(today.getFullYear(), 8, 5);

  const includedCategoryIds = [403441, 403438, 406718, 403440];

  if (today >= startDate && today <= endDate) {
    const eligibleItems = data.filter((item) =>
      item.cat.some((cat) => includedCategoryIds.includes(cat.id))
    );

    const freePizza = Math.floor(
      eligibleItems.reduce((acc, item) => acc + item.qte, 0) / 2
    );

    if (freePizza < 1) return fees;

    if (freePizza >= 2 && !address.toLowerCase().startsWith("bonabe")) {
      return 0;
    }

    return fees;
  }

  return fees;
}

export function sendPackPromotion(data: cartItem[]): cartItem[] {
  const result = [...data];

  const promotions: Record<string, { id: string; nom: string }[]> = {
    "1747699": [
      { id: "1748401", nom: "Produit A - Jongleur" },
      { id: "1748400", nom: "Produit B - Jongleur" },
      { id: "1748399", nom: "Produit C - Jongleur" },
    ],
    "1747700": [
      { id: "1748404", nom: "Produit A - Porteur" },
      { id: "1748402", nom: "Produit B - Porteur" },
    ],
    "1747701": [
      { id: "1748407", nom: "Produit A - Suspendu" },
      { id: "1748406", nom: "Produit B - Suspendu" },
      { id: "1748405", nom: "Produit C - Suspendu" },
    ],
  };

  for (const item of data) {
    const bonusItems = promotions[item.id];
    if (bonusItems && item.qte > 0) {
      bonusItems.forEach((bonus) => {
        for (let i = 0; i < item.qte; i++) {
          result.push({
            id: bonus.id,
            qte: 1,
            nom: bonus.nom,
            itemId: parseInt(bonus.id),
            options: [],
            price: 0,
            image: "",
            cat: [],
          });
        }
      });
    }
  }

  return result;
}
