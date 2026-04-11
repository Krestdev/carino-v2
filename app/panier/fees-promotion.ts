import { pizzaCategoryIds } from "@/components/universal/promotions";
import { cartItem, PromotionDelivery } from "@/types/types";

const deliveryPromo: Array<PromotionDelivery> = [
    {
        id: "black-week",
        name: "Black Week",
        priority: 10,
        combinable: false,
        isActive: () => {
      const now = new Date();
      const start = new Date(2025, 10, 28); // 28 Nov 2025
      const end = new Date(2025, 11, 7);   // 7 Dec 2025
      const hourStart = 13; // 13h
      const hourEnd = 16;   // 16h
      return (
        now >= start &&
        now <= end &&
        now.getHours() >= hourStart &&
        now.getHours() < hourEnd
      );
    },
    apply: (fees:number, district: string, cart: Array<cartItem>)=>{
        const freeZones = ["Warda", "Bastos"];
        // 1) On compte le nombre total de pizzas
              const totalPizzaQty = cart.reduce((sum, item) => {
                const isPizza = item.cat.some((cat) =>
                  pizzaCategoryIds.includes(cat.id)
                );
                return sum + (isPizza ? item.qte : 0);
              }, 0);
        if(freeZones.some(x=> x.toLocaleLowerCase() === district.toLocaleLowerCase()) && totalPizzaQty > 1) return 0;
        return fees;
    },
}
];

export function ApplyDeliveryPromo(fees: number, district: string, cart: Array<cartItem>): number {
  const promotions:Array<PromotionDelivery> = deliveryPromo;
  const sorted = promotions
    .filter((p) => p.isActive())
    .sort((a, b) => a.priority - b.priority);

  // Pour l’instant on les applique toutes en chaîne.
  // Tu pourras ensuite affiner les règles de combinabilité si besoin.
  return sorted.reduce((currentCart, promo) => promo.apply(currentCart, district, cart), fees);
}