import { cartItem, Promotion } from "@/types/types";
import { X } from "lucide-react";

export const pizzaCategoryIds = [403441, 403438, 406718, 403440];

export const promos: Array<Promotion> = [
  {
    id: "margherita-can",
    name: "Margherita Special",
    priority: 1,
    combinable: true,
    isActive: () => {
      const now = new Date();
      const start = new Date(2026, 2, 9); // 09 Feb 2026
      const end = new Date(2026, 2, 15);
      return now >= start && now <= end;
    },
    apply: (cart: Array<cartItem>) => {
      const pizzaId: number = 1149662;
      const fanta: number = 1149579;
      const quantity = cart
        .filter((c) => c.itemId === pizzaId)
        .reduce((t, v) => t + v.qte, 0);
      if (quantity > 0)
        return [
          ...cart,
          {
            id: "1149579",
            qte: quantity,
            nom: "FANTA 33CL",
            itemId: 1149579,
            options: [],
            price: 1000,
            image: "https://media.zelty.fr/images/2221/6100/b6871.jpg",
            cat: [
              {
                id: 253214,
                name: "Boissons gazeuses",
              },
            ],
          },
        ];
      return cart;
    },
  },
  {
    id: "black-week",
    name: "Black Week",
    priority: 1,
    combinable: true,
    isActive: () => {
      const now = new Date();
      const start = new Date(2025, 10, 28); // 28 Nov 2025
      const end = new Date(2025, 11, 7); // 7 Dec 2025
      const hourStart = 6; // 13h
      const hourEnd = 16; // 16h
      return (
        now >= start &&
        now <= end &&
        now.getHours() >= hourStart &&
        now.getHours() < hourEnd
      );
    },
    apply: (cart: cartItem[]) => {
      const MULTIPLIER = 0.75; // 25% de réduction => prix * 0.75

      // 1) On compte le nombre total de pizzas
      const totalPizzaQty = cart.reduce((sum, item) => {
        const isPizza = item.cat.some((cat) =>
          pizzaCategoryIds.includes(cat.id),
        );
        return sum + (isPizza ? item.qte : 0);
      }, 0);

      // 2) Si moins de 2 pizzas -> on remet les prix d’origine
      if (totalPizzaQty < 2) {
        return cart.map((item) => {
          const isPizza = item.cat.some((cat) =>
            pizzaCategoryIds.includes(cat.id),
          );

          // Si ce n'est pas une pizza ou qu'on n'a pas d'originalPrice, on ne touche à rien
          if (!isPizza || item.originalPrice === undefined) return item;

          return {
            ...item,
            price: item.originalPrice,
            originalPrice: undefined, // on peut la virer pour éviter la confusion
          };
        });
      }

      // 3) Sinon, on applique la réduction sur les pizzas
      return cart.map((item) => {
        const isPizza = item.cat.some((cat) =>
          pizzaCategoryIds.includes(cat.id),
        );
        if (!isPizza) return item;

        const basePrice = item.originalPrice ?? item.price;
        const newPrice = Math.ceil(basePrice * MULTIPLIER);

        return {
          ...item,
          price: newPrice,
          originalPrice: basePrice,
        };
      });
    },
  },
];

export function ApplyPromotions(data: cartItem[]): cartItem[] {
  const promotions: Array<Promotion> = promos;
  const sorted = promotions
    .filter((p) => p.isActive())
    .sort((a, b) => a.priority - b.priority);

  // Pour l’instant on les applique toutes en chaîne.
  // Tu pourras ensuite affiner les règles de combinabilité si besoin.
  return sorted.reduce((currentCart, promo) => promo.apply(currentCart), data);
}

/* export function ApplyPromotion(data: cartItem[]): cartItem[]{
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
} */

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
