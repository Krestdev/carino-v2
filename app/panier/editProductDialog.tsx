"use client";
import { Button } from "@/components/ui/button";
import { XAF } from "@/lib/functions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Minus, Plus } from "lucide-react";
import useStore from "@/context/store";
import { useEffect, useState } from "react";
import {
  ProductOptionChild,
  ProductsResponse,
  cartItemOption,
  otherOption,
} from "@/types/types";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
//import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import ProductQuery from "@/queries/productQuery";

const FormSchema = z.object({
  quantity: z.number().positive({ message: "Doit être supérieur à 0" }),
  accompaniment: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        qte: z.number(),
        price: z.number(),
      })
    )
    .max(2, { message: "Vous ne pouvez pas choisir plus de 2" }),
  flavors: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        qte: z.number(),
        price: z.number(),
      })
    )
    .max(2, { message: "Vous ne pouvez pas choisir plus de 2" }),
  suppSauce: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      qte: z.number(),
      price: z.number(),
    })
  ),
  cuissonPates: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      qte: z.number(),
      price: z.number(),
    })
  ),
  typePates: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      qte: z.number(),
      price: z.number(),
    })
  ),
  sauces: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      qte: z.number(),
      price: z.number(),
    })
  ),
  cuissonViande: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      qte: z.number(),
      price: z.number(),
    })
  ),
  otherOptions: z.array(
    z.object({
      name: z.string(),
      details: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          qte: z.number(),
          price: z.number(),
        })
      ),
    })
  ),
});

interface EditProps {
  nom: string;
  qte: number;
  id: string;
  itemId: number;
  optionsCurrent: Array<cartItemOption>;
  image: string;
}

function EditProductDialog({
  nom,
  qte,
  id,
  itemId,
  optionsCurrent,
  image,
}: EditProps) {
  const { editCart } = useStore();

  const [open, setOpen] = useState(false);
  const products = new ProductQuery();
  const productData = useQuery({
    queryKey: ["produit", nom],
    queryFn: () => products.getProductByName(nom),
    enabled: nom ? true : false,
  });

  const accompagnements = productData.isSuccess
    ? productData.data.data[0].options.filter(
        (option) => option.name.toLocaleLowerCase() === "accompagnement"
      )
    : [];

  const suppSauce = productData.isSuccess
    ? productData.data.data[0].options.filter(
        (option) => option.name.toLocaleLowerCase() === "supplément sauces"
      )
    : [];
  const cuissonPates = productData.isSuccess
    ? productData.data.data[0].options.filter(
        (option) => option.name.toLocaleLowerCase() === "cuisson pates"
      )
    : [];
  const typePates = productData.isSuccess
    ? productData.data.data[0].options.filter(
        (option) => option.name.toLocaleLowerCase() === "types de pâtes"
      )
    : [];
  const sauces = productData.isSuccess
    ? productData.data.data[0].options.filter(
        (option) => option.name.toLocaleLowerCase() === "sauces"
      )
    : [];
  const cuissonViande = productData.isSuccess
    ? productData.data.data[0].options.filter(
        (option) => option.name.toLocaleLowerCase() === "cuisson viande"
      )
    : [];
  const flavors = productData.isSuccess
    ? productData.data.data[0].options.filter(
        (option) => option.name.toLocaleLowerCase() === "saveurs"
      )
    : [];
  const supplements = productData.isSuccess
    ? productData.data.data[0].options
        .map((option) => ({
          name: option.name,
          id_zelty: option.id_zelty,
          enfants: option.enfants.map((enfant) => ({
            name: enfant.name,
            id_zelty: enfant.id_zelty,
            price: Number(enfant.price),
            max_choices: enfant.max_choices,
            min_choices: enfant.min_choices,
          })),
        }))
        .filter(
          (option) =>
            option.name.toLocaleLowerCase() != "accompagnement" &&
            option.name.toLocaleLowerCase() != "supplément sauces" &&
            option.name.toLocaleLowerCase() != "cuisson pates" &&
            option.name.toLocaleLowerCase() !=
              "Types de pâtes".toLocaleLowerCase() &&
            option.name.toLocaleLowerCase() != "sauces" &&
            option.name.toLocaleLowerCase() != "cuisson viande" &&
            option.name.toLocaleLowerCase() != "saveurs"
        )
    : [];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      quantity: qte,
      accompaniment:
        optionsCurrent.find(
          (option) => option.name.toLocaleLowerCase() === "accompagnement"
        )?.details || [],
      flavors:
        optionsCurrent.find(
          (option) => option.name.toLocaleLowerCase() === "saveurs"
        )?.details || [],
      suppSauce:
        optionsCurrent.find(
          (option) => option.name.toLocaleLowerCase() === "supplément sauces"
        )?.details || [],
      cuissonPates:
        optionsCurrent.find(
          (option) => option.name.toLocaleLowerCase() === "cuisson pates"
        )?.details || [],
      cuissonViande:
        optionsCurrent.find(
          (option) => option.name.toLocaleLowerCase() === "cuisson viande"
        )?.details || [],
      sauces:
        optionsCurrent.find(
          (option) => option.name.toLocaleLowerCase() === "sauces"
        )?.details || [],
      typePates:
        optionsCurrent.find(
          (option) =>
            option.name.toLocaleLowerCase() ===
            "Types de pâtes".toLocaleLowerCase()
        )?.details || [],
      otherOptions: optionsCurrent.filter(
        (option) =>
          option.name.toLocaleLowerCase() != "accompagnement" &&
          option.name.toLocaleLowerCase() != "supplément sauces" &&
          option.name.toLocaleLowerCase() != "cuisson pates" &&
          option.name.toLocaleLowerCase() !=
            "Types de pâtes".toLocaleLowerCase() &&
          option.name.toLocaleLowerCase() != "sauces" &&
          option.name.toLocaleLowerCase() != "cuisson viande" &&
          option.name.toLocaleLowerCase() != "saveurs"
      ),
    },
  });

  const price = productData.isSuccess ? productData.data.data[0].price : 0;

  const getTotal = (val: otherOption[]) => {
    let total = price;
    if (val.length > 0) {
      val.forEach((option) =>
        option.details.forEach(
          (detail) => (total = total + detail.price * detail.qte)
        )
      );
    }
    return total;
  };

  const [currentPrice, setCurrentPrice] = useState(XAF.format(price));
  useEffect(() => {
    const allOptions = [...form.getValues().otherOptions];
    if (form.getValues().accompaniment.length > 0) {
      allOptions.push({
        name: "Accompagnement",
        details: form.getValues().accompaniment,
      });
    }
    if (form.getValues().cuissonPates.length > 0) {
      allOptions.push({
        name: "Cuisson Pates",
        details: form.getValues().cuissonPates,
      });
    }
    if (form.getValues().suppSauce.length > 0) {
      allOptions.push({
        name: "Supplément Sauces",
        details: form.getValues().suppSauce,
      });
    }
    if (form.getValues().typePates.length > 0) {
      allOptions.push({
        name: "Types de pâtes",
        details: form.getValues().typePates,
      });
    }
    if (form.getValues().sauces.length > 0) {
      allOptions.push({ name: "Sauces", details: form.getValues().sauces });
    }
    if (form.getValues().cuissonViande.length > 0) {
      allOptions.push({
        name: "Cuisson Viande",
        details: form.getValues().cuissonViande,
      });
    }
    if (form.getValues().flavors.length > 0) {
      allOptions.push({ name: "Saveurs", details: form.getValues().flavors });
    }
    setCurrentPrice(
      XAF.format(getTotal(allOptions) * form.getValues().quantity)
    );
  }, [form.watch()]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const cartOption = () => {
      const result = [...data.otherOptions];
      if (data.accompaniment.length > 0) {
        result.push({ name: "Accompagnement", details: data.accompaniment });
      }
      if (data.cuissonPates.length > 0) {
        result.push({ name: "Cuisson Pates", details: data.cuissonPates });
      }
      if (data.suppSauce.length > 0) {
        result.push({ name: "Supplément Sauces", details: data.suppSauce });
      }
      if (data.typePates.length > 0) {
        result.push({ name: "Types de pâtes", details: data.typePates });
      }
      if (data.sauces.length > 0) {
        result.push({ name: "Sauces", details: data.sauces });
      }
      if (data.cuissonViande.length > 0) {
        result.push({ name: "Cuisson Viande", details: data.cuissonViande });
      }
      if (data.flavors.length > 0) {
        result.push({ name: "Saveurs", details: data.flavors });
      }
      return result;
    };

    editCart({
      id: id.toString(),
      qte: data.quantity,
      nom: nom,
      itemId: itemId,
      options: cartOption(),
      price: getTotal(cartOption()),
      image: image ? image : "/images/imagePlaceholder.svg",
      cat: [],
    });

    toast({
      title: "Votre commande a été modifié",
      description: (
        <Link href="/panier">
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {data.quantity} {nom}
            </code>
          </pre>
        </Link>
      ),
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} className="select-none" variant={"outline"}>
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="!relative py-5 min-h-[100px] flex items-center">
            <div className="absolute w-full h-full bg-gradient-to-t from-black/40 to-black/80 -z-10" />
            <img
              src={image || "/images/imagePlaceholder.svg"}
              alt={nom}
              className="w-full h-full object-cover absolute -z-20" /* width={600} height={400} */
            />
            <span className="px-4 text-white">{nom}</span>
          </DialogTitle>
        </DialogHeader>
        {productData.isLoading ? (
          <div className="py-3 px-4">Chargement...</div>
        ) : (
          productData.isSuccess && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col w-full odd:bg-gray-200 text-center pb-7 px-6"
              >
                {accompagnements.length > 0 && (
                  <div>
                    <div className="productDetailTitle">
                      {"Accompagnements"}
                      <p className="text-sm font-normal normal-case">
                        Vous pouvez en sélectionner 2 au plus
                      </p>
                    </div>
                    <div className="productDetailInput">
                      {accompagnements[0].enfants.map((item, id) => (
                        <div
                          key={id}
                          className="flex max-w-md w-full justify-between gap-3 py-2 flex-wrap"
                        >
                          <FormItem>
                            <FormField
                              control={form.control}
                              name="accompaniment"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value.some(
                                          (el) => el.id === item.id_zelty
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.value.length <= 1
                                              ? field.onChange([
                                                  ...field.value,
                                                  {
                                                    id: item.id_zelty,
                                                    name: item.name,
                                                    qte: 1,
                                                    price: 0,
                                                  },
                                                ])
                                              : null
                                            : field.value.length <= 1
                                            ? field.onChange([])
                                            : field.onChange([
                                                ...field.value.filter(
                                                  (detail) =>
                                                    detail.id !== item.id_zelty
                                                ),
                                              ]);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-base capitalize font-normal">
                                      {item.name}
                                    </FormLabel>
                                    <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
                                      <FormMessage />
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          </FormItem>
                          {item.price > 0 && (
                            <div>{XAF.format(item.price)}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {flavors.length > 0 && (
                  <div>
                    <div className="productDetailTitle">
                      {flavors[0].name}
                      <p className="text-sm font-normal normal-case">
                        Vous pouvez en sélectionner 2 au plus
                      </p>
                    </div>
                    <div className="productDetailInput">
                      {flavors[0].enfants.map((item, id) => (
                        <div
                          key={id}
                          className="flex max-w-md w-full justify-between gap-3 py-2 flex-wrap"
                        >
                          <FormItem>
                            <FormField
                              control={form.control}
                              name="flavors"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value.some(
                                          (el) => el.id === item.id_zelty
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.value.length <= 1
                                              ? field.onChange([
                                                  ...field.value,
                                                  {
                                                    id: item.id_zelty,
                                                    name: item.name,
                                                    qte: 1,
                                                    price: Number(item.price),
                                                  },
                                                ])
                                              : null
                                            : field.value.length > 1 &&
                                                field.onChange([
                                                  ...field.value.filter(
                                                    (detail) =>
                                                      detail.id !==
                                                      item.id_zelty
                                                  ),
                                                ]);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-base capitalize font-normal">
                                      {item.name}
                                    </FormLabel>
                                    <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
                                      <FormMessage />
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          </FormItem>
                          {item.price > 0 && (
                            <div>{XAF.format(item.price)}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {suppSauce.length > 0 && (
                  <div>
                    <div className="productDetailTitle">
                      {suppSauce[0].name}
                    </div>
                    <div className="productDetailInput">
                      {suppSauce[0].enfants.map((item, id) => (
                        <div
                          key={id}
                          className="flex max-w-md w-full justify-between gap-3 py-2 flex-wrap"
                        >
                          <FormItem>
                            <FormField
                              control={form.control}
                              name="suppSauce"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value.some(
                                          (el) => el.id === item.id_zelty
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                {
                                                  id: item.id_zelty,
                                                  name: item.name,
                                                  qte: 1,
                                                  price: Number(item.price),
                                                },
                                              ])
                                            : field.onChange([]);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-base capitalize font-normal">
                                      {item.name}
                                    </FormLabel>
                                    <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
                                      <FormMessage />
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          </FormItem>
                          {item.price > 0 && (
                            <div>{XAF.format(item.price)}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {cuissonPates.length > 0 && (
                  <div>
                    <div className="productDetailTitle">
                      {cuissonPates[0].name}
                    </div>
                    <div className="productDetailInput">
                      {cuissonPates[0].enfants.map((item, id) => (
                        <div
                          key={id}
                          className="flex max-w-md w-full justify-between gap-3 py-2 flex-wrap"
                        >
                          <FormItem>
                            <FormField
                              control={form.control}
                              name="cuissonPates"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value.some(
                                          (el) => el.id === item.id_zelty
                                        )}
                                        onCheckedChange={(checked) => {
                                          return (
                                            checked &&
                                            field.onChange([
                                              {
                                                id: item.id_zelty,
                                                name: item.name,
                                                qte: 1,
                                                price: Number(item.price),
                                              },
                                            ])
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-base capitalize font-normal">
                                      {item.name}
                                    </FormLabel>
                                    <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
                                      <FormMessage />
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          </FormItem>
                          {item.price > 0 && (
                            <div>{XAF.format(item.price)}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {typePates.length > 0 && (
                  <div>
                    <div className="productDetailTitle">
                      {typePates[0].name}
                    </div>
                    <div className="productDetailInput">
                      {typePates[0].enfants.map((item, id) => (
                        <div
                          key={id}
                          className="flex max-w-md w-full justify-between gap-3 py-2 flex-wrap"
                        >
                          <FormItem>
                            <FormField
                              control={form.control}
                              name="typePates"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value.some(
                                          (el) => el.id === item.id_zelty
                                        )}
                                        onCheckedChange={(checked) => {
                                          return (
                                            checked &&
                                            field.onChange([
                                              {
                                                id: item.id_zelty,
                                                name: item.name,
                                                qte: 1,
                                                price: Number(item.price),
                                              },
                                            ])
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-base capitalize font-normal">
                                      {item.name}
                                    </FormLabel>
                                    <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
                                      <FormMessage />
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          </FormItem>
                          {item.price > 0 && (
                            <div>{XAF.format(item.price)}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {sauces.length > 0 && (
                  <div>
                    <div className="productDetailTitle">{sauces[0].name}</div>
                    <div className="productDetailInput">
                      {sauces[0].enfants.map((item, id) => (
                        <div
                          key={id}
                          className="flex max-w-md w-full justify-between gap-3 py-2 flex-wrap"
                        >
                          <FormItem>
                            <FormField
                              control={form.control}
                              name="sauces"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value.some(
                                          (el) => el.id === item.id_zelty
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                {
                                                  id: item.id_zelty,
                                                  name: item.name,
                                                  qte: 1,
                                                  price: Number(item.price),
                                                },
                                              ])
                                            : field.onChange([]);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-base capitalize font-normal">
                                      {item.name}
                                    </FormLabel>
                                    <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
                                      <FormMessage />
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          </FormItem>
                          {item.price > 0 && (
                            <div>{XAF.format(item.price)}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {cuissonViande.length > 0 && (
                  <div>
                    <div className="productDetailTitle">
                      {cuissonViande[0].name}
                    </div>
                    <div className="productDetailInput">
                      {cuissonViande[0].enfants.map((item, id) => (
                        <div
                          key={id}
                          className="flex max-w-md w-full justify-between gap-3 py-2 flex-wrap"
                        >
                          <FormItem>
                            <FormField
                              control={form.control}
                              name="cuissonViande"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value.some(
                                          (el) => el.id === item.id_zelty
                                        )}
                                        onCheckedChange={(checked) => {
                                          return (
                                            checked &&
                                            field.onChange([
                                              {
                                                id: item.id_zelty,
                                                name: item.name,
                                                qte: 1,
                                                price: Number(item.price),
                                              },
                                            ])
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-base capitalize font-normal">
                                      {item.name}
                                    </FormLabel>
                                    <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
                                      <FormMessage />
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          </FormItem>
                          {item.price > 0 && (
                            <div>{XAF.format(item.price)}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {supplements.length > 0 &&
                  supplements.map((option, id) => (
                    <div key={id}>
                      <div className="productDetailTitle">{option.name}</div>
                      <div className="productDetailInput">
                        {option.enfants.map((item) => (
                          <div
                            key={item.name}
                            className="flex max-w-md w-full justify-between gap-3 py-2 flex-wrap"
                          >
                            <FormItem>
                              <FormField
                                control={form.control}
                                name="otherOptions"
                                render={({ field }) => {
                                  const optionIndex = field.value.findIndex(
                                    (val) => val.name === option.name
                                  );
                                  const detailIndex =
                                    optionIndex !== -1
                                      ? field.value[
                                          optionIndex
                                        ].details.findIndex(
                                          (dt) => dt.name === item.name
                                        )
                                      : -1;
                                  const currentQuantity =
                                    field.value.findIndex(
                                      (op) => op.name === option.name
                                    ) >= 0
                                      ? field.value[
                                          field.value.findIndex(
                                            (op) => op.name === option.name
                                          )
                                        ].details.findIndex(
                                          (dt) => dt.name === item.name
                                        ) >= 0
                                        ? field.value[optionIndex].details[
                                            detailIndex
                                          ].qte
                                        : 0
                                      : 0;
                                  return (
                                    <FormItem
                                      key={item.name}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <div className="flex flex-row gap-0 items-center">
                                          <Button
                                            variant={"outline"}
                                            size={"icon"}
                                            className="h-4 w-4 rounded-none"
                                            onClick={(e) => {
                                              detailIndex >= 0 &&
                                                field.onChange(
                                                  field.value
                                                    .map((op) =>
                                                      op.name === option.name
                                                        ? currentQuantity > 1
                                                          ? {
                                                              name: op.name,
                                                              details:
                                                                op.details.map(
                                                                  (dt) =>
                                                                    dt.name ===
                                                                    item.name
                                                                      ? {
                                                                          id: dt.id,
                                                                          name: dt.name,
                                                                          price:
                                                                            dt.price,
                                                                          qte:
                                                                            dt.qte -
                                                                            1,
                                                                        }
                                                                      : dt
                                                                ),
                                                            }
                                                          : currentQuantity ===
                                                            1
                                                          ? {
                                                              name: op.name,
                                                              details:
                                                                op.details.filter(
                                                                  (dt) =>
                                                                    dt.name !==
                                                                    item.name
                                                                ),
                                                            }
                                                          : op
                                                        : op
                                                    )
                                                    .filter(
                                                      (op) =>
                                                        op.details.length > 0
                                                    )
                                                );
                                              e.preventDefault();
                                            }}
                                          >
                                            <Minus size={16} />
                                          </Button>
                                          <span className="w-5">
                                            {currentQuantity}
                                          </span>
                                          <Button
                                            variant={"outline"}
                                            size={"icon"}
                                            className="h-4 w-4 rounded-none"
                                            onClick={(e) => {
                                              detailIndex >= 0
                                                ? field.onChange(
                                                    field.value.map((op) =>
                                                      op.name === option.name
                                                        ? {
                                                            name: op.name,
                                                            details:
                                                              op.details.map(
                                                                (dt) =>
                                                                  dt.name ===
                                                                  item.name
                                                                    ? dt.qte < 3
                                                                      ? {
                                                                          id: dt.name,
                                                                          name: dt.name,
                                                                          price:
                                                                            dt.price,
                                                                          qte:
                                                                            dt.qte +
                                                                            1,
                                                                        }
                                                                      : dt
                                                                    : dt
                                                              ),
                                                          }
                                                        : op
                                                    )
                                                  )
                                                : detailIndex < 0 &&
                                                  optionIndex >= 0
                                                ? field.onChange(
                                                    field.value.map((op) =>
                                                      op.name === option.name
                                                        ? {
                                                            name: op.name,
                                                            details: [
                                                              ...op.details,
                                                              {
                                                                id: item.id_zelty,
                                                                name: item.name,
                                                                price:
                                                                  item.price,
                                                                qte: 1,
                                                              },
                                                            ],
                                                          }
                                                        : op
                                                    )
                                                  )
                                                : field.onChange([
                                                    ...field.value,
                                                    {
                                                      name: option.name,
                                                      details: [
                                                        {
                                                          id: item.id_zelty,
                                                          name: item.name,
                                                          price: item.price,
                                                          qte: 1,
                                                        },
                                                      ],
                                                    },
                                                  ]);
                                              console.log(field.value);
                                              e.preventDefault();
                                            }}
                                          >
                                            <Plus size={16} />
                                          </Button>
                                        </div>
                                      </FormControl>
                                      <FormLabel className="text-base capitalize font-normal">
                                        {item.name}
                                      </FormLabel>
                                      <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
                                        <FormMessage />
                                      </div>
                                    </FormItem>
                                  );
                                }}
                              />
                            </FormItem>

                            <div>{XAF.format(item.price)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                <div className="productDetailInput">
                  <div className="flex max-w-md w-full justify-center items-center gap-3 py-2 flex-wrap">
                    <div className="flex flex-col text-left">
                      <Label className="uppercase">prix total</Label>
                      <span className="font-bold text-xl">{currentPrice}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-center flex-wrap gap-4">
                  <Button className="mt-6" type="submit">
                    Ajouter au panier
                  </Button>
                </div>
              </form>
            </Form>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditProductDialog;
