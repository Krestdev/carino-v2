"use client";
import { Button } from "@/components/ui/button";
import { XAF } from "@/lib/functions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Minus, Plus } from "lucide-react";
import useStore from "@/context/store";
import { useEffect, useState } from "react";
import { ProductsData, otherOption, Option } from "@/types/types";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
//import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { Alert, AlertTitle } from "../ui/alert";
import { Input } from "../ui/input";
import { LuMinus, LuPlus } from "react-icons/lu";

const FormSchema = z.object({
  quantity: z.number().positive({ message: "Doit être supérieur à 0" }),
  accompaniement: z.array(
    z.object({
      name: z.string(),
      id_zelty: z.string(),
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
  optionalSupplements: z.array(
    z.object({
      name: z.string(),
      id_zelty: z.string(),
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
  uniqueOptions: z.array(
    z.object({
      name: z.string(),
      id_zelty: z.string(),
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
  supplementBurger: z.array(
    z.object({
      name: z.string(),
      id_zelty: z.string(),
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
  supplementPizza: z.array(
    z.object({
      name: z.string(),
      id_zelty: z.string(),
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

interface DialogProps {
  buttonSize?: "full" | "default" | "xl";
  buttonText?: string;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link";
  children?: React.JSX.Element;
}

function AddDialog({
  id,
  name,
  options = [],
  price,
  image,
  cat,
  description,
  children,
}: DialogProps & ProductsData) {
  const { addToCart } = useStore();
  const router = useRouter();
  //console.log(options);

  const [open, setOpen] = useState(false);
  //function to return a default value for option that must have a value
  const getDefaultValues = (fish: Option[]) => {
    if (fish.length > 0) {
      return fish.map((f) => ({
        name: f.name,
        id_zelty: f.id_zelty,
        details: [
          {
            id: f.enfants[0].id_zelty,
            name: f.enfants[0].name,
            price: Number(f.enfants[0].price),
            qte: 1,
          },
        ],
      }));
    }
    return [];
  };

  const unique = ["198760", "198951", "198953", "198955"]; //always selected

  const optionals = ["199268", "198952"]; //5 max

  const uniqueAccompaniement = ["198950"];

  const optBurger = ["198763"]; //3 max

  const optPizza = ["198762"]; //22 max

  const accompagnements = options.filter((option) =>
    uniqueAccompaniement.includes(option.id_zelty)
  );
  const optSupplements = options.filter((option) =>
    optionals.includes(option.id_zelty)
  );
  const uniqueOptions = options.filter((option) =>
    unique.includes(option.id_zelty)
  );
  const optSuppBurger = options.filter((option) =>
    optBurger.includes(option.id_zelty)
  );
  const optSuppPizza = options.filter((option) =>
    optPizza.includes(option.id_zelty)
  );

  const [showOptions, setshowOptions] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      quantity: 1,
      accompaniement: getDefaultValues(accompagnements),
      optionalSupplements: [],
      uniqueOptions: getDefaultValues(uniqueOptions),
      supplementBurger: [],
      supplementPizza: [],
    },
  });

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

  useEffect(() => {
    if (!open) {
      form.reset();
      setshowOptions(
        accompagnements.length > 0 ||
          optSuppBurger.length > 0 ||
          optSuppPizza.length > 0 ||
          optSupplements.length > 0 ||
          uniqueOptions.length > 0
      );
    }
  }, [
    open,
    form,
    accompagnements.length,
    optSuppBurger.length,
    optSuppPizza.length,
    optSupplements.length,
    uniqueOptions.length,
  ]);

  const [currentPrice, setCurrentPrice] = useState(XAF.format(price));
  useEffect(() => {
    const allOptions = [
      ...form.getValues().accompaniement,
      ...form.getValues().optionalSupplements,
      ...form.getValues().supplementBurger,
      ...form.getValues().supplementPizza,
      ...form.getValues().uniqueOptions,
    ];
    setCurrentPrice(
      XAF.format(getTotal(allOptions) * form.getValues().quantity)
    );
  }, [form.watch(), getTotal, form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const cartOption = () => {
      const result = [
        ...data.accompaniement,
        ...data.optionalSupplements,
        ...data.supplementBurger,
        ...data.supplementPizza,
        ...data.uniqueOptions,
      ];
      return result;
    };
    addToCart({
      id: id.toString(),
      qte: data.quantity,
      nom: name,
      itemId: Date.now(),
      options: cartOption(),
      price: getTotal(cartOption()),
      image: image ? image : "/images/imagePlaceholder.svg",
      cat: cat,
    });

    toast({
      title: "Une commande ajoutée au panier !",
      description: (
        <Link href="/panier">
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {data.quantity} {name}
            </code>
          </pre>
        </Link>
      ),
    });
    setOpen(false);
    router.push("/panier");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={`max-h-[80vh] flex flex-col`}>
        <DialogHeader className="sticky top-0 bg-white">
          <DialogTitle className="!relative py-5 min-h-[144px] flex items-center">
            <div className="absolute w-full h-full bg-gradient-to-t from-black/40 to-black/80 -z-10" />
            <img
              src={image || "/images/imagePlaceholder.svg"}
              alt={name}
              className="w-full h-full object-cover rounded-t-[12px] absolute -z-20"
              loading="lazy"
            />
            <span className="px-4 text-white font-sans">{name}</span>
          </DialogTitle>
          <DialogDescription className="text-black text-[18px] text-center line-clamp-3">
          <DialogDescription className="text-black text-[16px] text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col overflow-y-auto"
          >
            {showOptions && (
              <div className="flex flex-col w-full text-center pb-7 px-6 flex-1 overflow-y-auto border border-dashed border-gray-400 rounded-lg my-scrollbox">
                {accompagnements.length > 0 &&
                  accompagnements.map((option, id) => (
                    <div key={id} className="relative">
                      <div className="productDetailTitle sticky top-0 backdrop-blur-lg">
                        {option.name}
                      </div>
                      <div className="productDetailInput">
                        {option.enfants.map((item) => (
                          <div
                            key={item.name}
                            className="flex max-w-md w-full justify-between gap-3 py-2 flex-wrap odd:bg-gray-200 px-2"
                          >
                            <FormField
                              control={form.control}
                              name="accompaniement"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      className="border-gray-500"
                                      checked={field.value.some((el) =>
                                        el.details.some(
                                          (x) => x.id === item.id_zelty
                                        )
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.value.filter(
                                              (x) => x.name === option.name
                                            ).length < 5
                                            ? field.onChange([
                                                ...field.value,
                                                {
                                                  name: option.name,
                                                  id_zelty: option.id_zelty,
                                                  details: [
                                                    {
                                                      id: item.id_zelty,
                                                      name: item.name,
                                                      price: Number(item.price),
                                                      qte: 1,
                                                    },
                                                  ],
                                                },
                                              ])
                                            : null
                                          : field.onChange([
                                              ...field.value.filter((el) =>
                                                el.details.some(
                                                  (x) => x.id !== item.id_zelty
                                                )
                                              ),
                                            ]);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-base capitalize font-normal">
                                    {item.name}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                            {item.price > 0 && (
                              <div>{XAF.format(item.price)}</div>
                            )}
                          </div>
                        ))}
                        {form.getFieldState("accompaniement").error && (
                          <Alert variant={"destructive"}>
                            <AlertTitle>
                              {"Veuillez selectionner un accompagnement"}
                            </AlertTitle>
                          </Alert>
                        )}
                      </div>
                    </div>
                  ))}
                {uniqueOptions.length > 0 &&
                  uniqueOptions.map((option, id) => (
                    <div key={id} className=" relative">
                      <div className="productDetailTitle sticky top-0 backdrop-blur-lg">
                        {option.name}
                      </div>
                      <div className="productDetailInput">
                        {option.enfants.map((item) => (
                          <div
                            key={item.name}
                            className="flex max-w-md w-full justify-between gap-3 py-2 flex-wrap odd:bg-gray-200 px-2"
                          >
                            <FormField
                              control={form.control}
                              name="uniqueOptions"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value.some((el) =>
                                        el.details.some(
                                          (x) => x.id === item.id_zelty
                                        )
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange(
                                              field.value.map((x) =>
                                                x.id_zelty !== option.id_zelty
                                                  ? x
                                                  : {
                                                      name: option.name,
                                                      id_zelty: option.id_zelty,
                                                      details: [
                                                        {
                                                          name: item.name,
                                                          id: item.id_zelty,
                                                          price: Number(
                                                            item.price
                                                          ),
                                                          qte: 1,
                                                        },
                                                      ],
                                                    }
                                              )
                                            )
                                          : null; //field.onChange([...field.value.filter(el=>el.details.some(x=>x.id!==item.id_zelty))])
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
                              )}
                            />
                            {item.price > 0 && (
                              <div>{XAF.format(item.price)}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                {optSupplements.length > 0 &&
                  optSupplements.map((option, id) => (
                    <div key={id} className="relative">
                      <div className="productDetailTitle sticky top-0 backdrop-blur-lg">
                        {option.name}
                      </div>
                      <div className="productDetailInput">
                        {option.enfants.map((item) => (
                          <div
                            key={item.name}
                            className="flex max-w-md w-full justify-between gap-3 py-2 flex-wrap odd:bg-gray-200 px-2"
                          >
                            <FormField
                              control={form.control}
                              name="optionalSupplements"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value.some((el) =>
                                        el.details.some(
                                          (x) => x.id === item.id_zelty
                                        )
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.value.filter(
                                              (x) => x.name === option.name
                                            ).length < 5
                                            ? field.onChange([
                                                ...field.value,
                                                {
                                                  name: option.name,
                                                  id_zelty: option.id_zelty,
                                                  details: [
                                                    {
                                                      id: item.id_zelty,
                                                      name: item.name,
                                                      price: Number(item.price),
                                                      qte: 1,
                                                    },
                                                  ],
                                                },
                                              ])
                                            : null
                                          : field.onChange([
                                              ...field.value.filter((el) =>
                                                el.details.some(
                                                  (x) => x.id !== item.id_zelty
                                                )
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
                              )}
                            />
                            {item.price > 0 && (
                              <div>{XAF.format(item.price)}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                {optSuppBurger.length > 0 &&
                  optSuppBurger.map((option, id) => (
                    <div key={id} className="relative">
                      <div className="productDetailTitle sticky top-0 backdrop-blur-lg">
                        {option.name}
                      </div>
                      <div className="productDetailInput">
                        {option.enfants.map((item) => (
                          <div
                            key={item.name}
                            className="flex max-w-md w-full justify-between gap-3 py-2 flex-wrap odd:bg-gray-200 px-2"
                          >
                            <FormField
                              control={form.control}
                              name="supplementBurger"
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
                                  detailIndex >= 0
                                    ? field.value[optionIndex].details[
                                        detailIndex
                                      ].qte
                                    : 0;
                                return (
                                  <FormItem
                                    key={item.name}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <div className="flex flex-row gap-1 items-center">
                                        <span className="w-5">
                                          {currentQuantity}
                                        </span>
                                        <Button
                                          //   variant={"green"}
                                          size={"icon"}
                                          className="h-5 w-5 rounded"
                                          onClick={(e) => {
                                            optionIndex < 0
                                              ? field.onChange([
                                                  ...field.value,
                                                  {
                                                    name: option.name,
                                                    id_zelty: option.id_zelty,
                                                    details: [
                                                      {
                                                        id: item.id_zelty,
                                                        name: item.name,
                                                        price: Number(
                                                          item.price
                                                        ),
                                                        qte: 1,
                                                      },
                                                    ],
                                                  },
                                                ])
                                              : detailIndex < 0 &&
                                                field.value[
                                                  optionIndex
                                                ].details.reduce(
                                                  (total, el) => total + el.qte,
                                                  0
                                                ) < 3
                                              ? field.onChange(
                                                  field.value.map((op) =>
                                                    op.name !== option.name
                                                      ? op
                                                      : {
                                                          name: op.name,
                                                          id_zelty: op.id_zelty,
                                                          details: [
                                                            ...op.details,
                                                            {
                                                              id: item.id_zelty,
                                                              name: item.name,
                                                              price: Number(
                                                                item.price
                                                              ),
                                                              qte: 1,
                                                            },
                                                          ],
                                                        }
                                                  )
                                                )
                                              : detailIndex < 0 &&
                                                field.value[
                                                  optionIndex
                                                ].details.reduce(
                                                  (total, el) => total + el.qte,
                                                  0
                                                ) >= 3
                                              ? null
                                              : detailIndex >= 0 &&
                                                field.value[
                                                  optionIndex
                                                ].details.reduce(
                                                  (total, el) => total + el.qte,
                                                  0
                                                ) < 3
                                              ? field.onChange(
                                                  field.value.map((op) =>
                                                    op.name !== option.name
                                                      ? op
                                                      : {
                                                          name: op.name,
                                                          id_zelty: op.id_zelty,
                                                          details:
                                                            op.details.map(
                                                              (el) =>
                                                                el.name !==
                                                                item.name
                                                                  ? el
                                                                  : {
                                                                      name: el.name,
                                                                      id: el.id,
                                                                      price:
                                                                        Number(
                                                                          el.price
                                                                        ),
                                                                      qte:
                                                                        el.qte +
                                                                        1,
                                                                    }
                                                            ),
                                                        }
                                                  )
                                                )
                                              : null;

                                            //console.log(form.getValues())
                                            e.preventDefault();
                                          }}
                                        >
                                          <Plus size={16} />
                                        </Button>
                                        <Button
                                          variant={"outline"}
                                          size={"icon"}
                                          className="h-5 w-5 rounded"
                                          onClick={(e) => {
                                            detailIndex >= 0 &&
                                              field.onChange(
                                                field.value
                                                  .map((op) =>
                                                    op.name === option.name
                                                      ? currentQuantity > 1
                                                        ? {
                                                            name: op.name,
                                                            id_zelty:
                                                              op.id_zelty,
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
                                                        : currentQuantity === 1
                                                        ? {
                                                            name: op.name,
                                                            id_zelty:
                                                              op.id_zelty,
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
                                          <Minus
                                            size={16}
                                            className="text-primary"
                                          />
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
                            {item.price > 0 && (
                              <div>{XAF.format(item.price)}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                {optSuppPizza.length > 0 &&
                  optSuppPizza.map((option, id) => (
                    <div key={id} className="relative">
                      <div className="productDetailTitle sticky top-0 backdrop-blur-lg">
                        {option.name}
                      </div>
                      <div className="productDetailInput">
                        {option.enfants.map((item) => (
                          <div
                            key={item.name}
                            className="flex max-w-md w-full justify-between gap-3 py-2 flex-wrap"
                          >
                            <FormField
                              control={form.control}
                              name="supplementPizza"
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
                                  detailIndex >= 0
                                    ? field.value[optionIndex].details[
                                        detailIndex
                                      ].qte
                                    : 0;
                                return (
                                  <FormItem
                                    key={item.name}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <div className="flex flex-row gap-1 items-center">
                                        <span className="w-5">
                                          {currentQuantity}
                                        </span>
                                        <Button
                                          //   variant={"green"}
                                          size={"icon"}
                                          className="h-5 w-5 rounded"
                                          onClick={(e) => {
                                            optionIndex < 0
                                              ? field.onChange([
                                                  ...field.value,
                                                  {
                                                    name: option.name,
                                                    id_zelty: option.id_zelty,
                                                    details: [
                                                      {
                                                        id: item.id_zelty,
                                                        name: item.name,
                                                        price: Number(
                                                          item.price
                                                        ),
                                                        qte: 1,
                                                      },
                                                    ],
                                                  },
                                                ])
                                              : detailIndex < 0 &&
                                                field.value[
                                                  optionIndex
                                                ].details.reduce(
                                                  (total, el) => total + el.qte,
                                                  0
                                                ) < 22
                                              ? field.onChange(
                                                  field.value.map((op) =>
                                                    op.name !== option.name
                                                      ? op
                                                      : {
                                                          name: op.name,
                                                          id_zelty: op.id_zelty,
                                                          details: [
                                                            ...op.details,
                                                            {
                                                              id: item.id_zelty,
                                                              name: item.name,
                                                              price: Number(
                                                                item.price
                                                              ),
                                                              qte: 1,
                                                            },
                                                          ],
                                                        }
                                                  )
                                                )
                                              : detailIndex < 0 &&
                                                field.value[
                                                  optionIndex
                                                ].details.reduce(
                                                  (total, el) => total + el.qte,
                                                  0
                                                ) >= 22
                                              ? null
                                              : detailIndex >= 0 &&
                                                field.value[
                                                  optionIndex
                                                ].details.reduce(
                                                  (total, el) => total + el.qte,
                                                  0
                                                ) < 22
                                              ? field.onChange(
                                                  field.value.map((op) =>
                                                    op.name !== option.name
                                                      ? op
                                                      : {
                                                          name: op.name,
                                                          id_zelty: op.id_zelty,
                                                          details:
                                                            op.details.map(
                                                              (el) =>
                                                                el.name !==
                                                                item.name
                                                                  ? el
                                                                  : {
                                                                      name: el.name,
                                                                      id: el.id,
                                                                      price:
                                                                        Number(
                                                                          el.price
                                                                        ),
                                                                      qte:
                                                                        el.qte +
                                                                        1,
                                                                    }
                                                            ),
                                                        }
                                                  )
                                                )
                                              : null;

                                            //console.log(form.getValues())
                                            e.preventDefault();
                                          }}
                                        >
                                          <Plus size={16} />
                                        </Button>
                                        <Button
                                          variant={"outline"}
                                          size={"icon"}
                                          className="h-5 w-5 rounded"
                                          onClick={(e) => {
                                            detailIndex >= 0 &&
                                              field.onChange(
                                                field.value
                                                  .map((op) =>
                                                    op.name === option.name
                                                      ? currentQuantity > 1
                                                        ? {
                                                            name: op.name,
                                                            id_zelty:
                                                              op.id_zelty,
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
                                                        : currentQuantity === 1
                                                        ? {
                                                            name: op.name,
                                                            id_zelty:
                                                              op.id_zelty,
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
                                          <Minus
                                            size={16}
                                            className="text-primary"
                                          />
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
                            {item.price > 0 && (
                              <div>{XAF.format(item.price)}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex flex-col justify-center items-center gap-2">
              <div className="productDetailInput">
                <p className="text-sm text-red-500 mt-1">
                  La quantité choisie s’appliquera aux mêmes options
                  sélectionnées.
                </p>
                <div className="flex max-w-md w-full justify-center items-center gap-5 divide-x py-2 flex-wrap">
                  <div className="flex items-center justify-center pr-5">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold">Quantité</FormLabel>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              onClick={() =>
                                field.onChange(Math.max(1, Number(field.value || 1) - 1))
                              }
                              variant="outline"
                              size="icon"
                              className="h-5 w-5 rounded"
                            >
                              <LuMinus className="cursor-pointer text-primary" />
                            </Button>


                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value ?? 0}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="w-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
                              />
                            </FormControl>

                            <Button
                              type="button"
                              onClick={() =>
                                field.onChange(Number(field.value || 0) + 1)
                              }
                              size="icon"
                              className="h-5 w-5 rounded"
                            >
                              <LuPlus className="cursor-pointer" />
                            </Button>
                          </div>
                          <div className="absolute bottom-0 left-[50%] translate-x-[-50%]">
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col text-center">
                    <Label className="uppercase">prix total</Label>
                    <span className="font-bold text-xl">{currentPrice}</span>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-center flex-wrap gap-4">
                <Button type="submit">Ajouter au panier</Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddDialog;
