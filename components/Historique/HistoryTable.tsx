import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { XAF } from "@/lib/functions";
import { AddtressData, OrdersData } from "@/types/types";
import { useState } from "react";
import { LuEye } from "react-icons/lu";
import { Button } from "../ui/button";
import ViewOrderDialog from "./ViewOrderDialog";

interface Props {
  title: string;
  data: OrdersData[];
  towns: AddtressData[] | undefined;
}

const HistoryTable = ({ title, data, towns }: Props) => {
  const [selectedOrder, setSelectedOrder] = useState<OrdersData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewOrder = (order: OrdersData) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedOrder(null);
  };

  // const jsonArray = (array: string) => {
  //   if (typeof array === "string") {
  //     return JSON.parse(array.replace(/\n/g, ""));
  //   } else {
  //     return array;
  //   }
  // };

  return (
    <div className="flex flex-col gap-5 w-full">
      <h3 className="text-xl font-bold">{title}</h3>
      <Table className="max-w-[1440px] w-full mx-auto border border-gray-300">
        <TableHeader className="bg-primary text-white">
          <TableRow className="divide-x divide-gray-300 hover:bg-primary/90">
            <TableHead className="font-bold text-white">{"References"}</TableHead>
            <TableHead className="font-bold text-white">{"Statuts"}</TableHead>
            <TableHead className="font-bold text-white">{"Etats de paiement"}</TableHead>
            <TableHead className="font-bold text-white">{"Commande"}</TableHead>
            <TableHead className="font-bold text-white">{"Prix"}</TableHead>
            <TableHead className="font-bold text-white">{"Date"}</TableHead>
            <TableHead className="font-bold text-white">{"Actions"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <TableRow className="divide-x divide-gray-200">
              <TableCell colSpan={7} className="text-center">
                {"Aucune donnée à afficher."}
              </TableCell>
            </TableRow>
          ) : (
            data.reverse().map((order, id) => {
              return (
                <TableRow key={id} className={`divide-x divide-gray-200 ${id % 2 === 0 ? "bg-gray-100" : ""}`}>
                  <TableCell className={`font-medium text-center`}>
                    {`${order.reference.slice(0, 15)}...`}
                  </TableCell>
                  <TableCell>
                    {!order.is_delivred ? (
                      order.is_paid ? (
                        <div className="flex gap-1 items-center">
                          <span className="bg-orange-600 h-2 w-2 rounded-full" />
                          {"En cours"}
                        </div>
                      ) : (
                        <div className="flex gap-1 items-center">{"---"}</div>
                      )
                    ) : (
                      <div className="flex gap-1 items-center">
                        <span className="bg-green-600 h-2 w-2 rounded-full" />
                        {"Livré"}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{
                    order.is_paid === 1 ?
                      <div>
                        <span className="bg-green-600 h-2 w-2 rounded-full" />
                        {"Payé"}
                      </div>
                      :
                      "Non payé"
                  }
                  </TableCell>
                  <TableCell className="truncate max-w-[200px]">
                    {(() => {
                      // Parse items to ensure it's an array
                      const parseItems = (items: unknown): string[] => {
                        if (Array.isArray(items)) {
                          return items.map((item) =>
                            typeof item === "string" ? item.replace(/"/g, "").trim() : String(item)
                          );
                        }

                        if (typeof items === "string") {
                          // Prend tout ce qui est avant le premier "]"
                          const beforeBracket = items.includes("]")
                            ? items.split("]")[0]
                            : items;

                          // Retire les crochets
                          const cleaned = beforeBracket.replace(/\[|\]/g, "").trim();

                          return cleaned
                            .split(",")
                            .map((item) => item.replace(/"/g, "").trim())
                            .filter((item) => item.length > 0);
                        }

                        return [];
                      };

                      const removeParenthesesContent = (items: string[]): string[] => {
                        return items
                          .map(item => item.replace(/\([^)]*\)/g, "").trim()) // supprime tout contenu entre parenthèses
                          .filter(item => item.length > 0); // supprime les chaînes vides
                      };

                      const items = removeParenthesesContent(parseItems(order.items));

                      const preview = items.join(`\n `);
                      return preview
                    })()}
                  </TableCell>

                  <TableCell>{XAF.format(Number(order.prix_total))}</TableCell>
                  <TableCell>
                    {order.created_at.toString().slice(0, 10)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={"outline"}
                      className="text-black border-[#848484]"
                      onClick={() => handleViewOrder(order)}
                    >
                      <LuEye />
                      {"voir"}
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      {selectedOrder && (
        <ViewOrderDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          order={selectedOrder}
          towns={towns}
        />
      )}
    </div>
  );
};

export default HistoryTable;
