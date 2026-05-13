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
import { normalizeText, parseItems } from "@/lib/utils";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";

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
              <TableCell colSpan={7} className="text-center h-24">
                {"Aucune donnée à afficher."}
              </TableCell>
            </TableRow>
          ) : (
            data.toReversed().map((order, id) => {
              return (
                <TableRow key={id} className={`divide-x divide-gray-200 ${id % 2 === 0 ? "bg-gray-100" : ""}`}>
                  <TableCell className={`font-medium text-center`}>
                    {`Ref-${order.uuid?.slice(0, 15)}...`}
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
                    <div className="flex flex-col gap-1">
                      {order.items ? order.items.map((item, id) =>
                        <div key={id} className="w-full text-sm font-medium text-gray-900 flex items-center gap-2">
                          <span>{normalizeText(item.name ?? "---")}</span>
                        </div>
                      ) : "---"}
                    </div>
                  </TableCell>

                  <TableCell>{XAF.format(Number(order.total))}</TableCell>
                  <TableCell>
                    {formatRelative(order.registration, new Date(), { locale: fr })}
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
