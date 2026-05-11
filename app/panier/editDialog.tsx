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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { ProductOption, OptionValue, ProdData, cartItem } from "@/types/types";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertTitle } from "@/components/ui/alert";
import useStore from "@/context/store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  children?: React.ReactElement;
  options: ProductOption[];
  product: ProdData;
  isEditing?: boolean;
  editItem?: cartItem | null;
  onEditComplete?: () => void;
}

// Structure pour suivre une option sélectionnée
interface SelectedOptionDetail {
  id: string;
  name: string;
  price: number;
  qte: number;
}

interface SelectedOptionGroup {
  name: string;
  id_zelty: string;
  details: SelectedOptionDetail[];
}

// Type pour les valeurs du formulaire
interface FormValues {
  quantity: number;
  [key: string]: any;
}

function AddDialog({ children, options, product, isEditing = false, editItem = null, onEditComplete }: DialogProps) {
  const { addToCart, updateCartItem, removeFromCart } = useStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Filtrer les options disponibles pour ce produit
  const productOptions = useMemo(() => {
    return options.filter(option =>
      product.options?.some(id => id.toString() === option.id.toString())
    );
  }, [options, product.options]);

  // Séparer les options par type
  const optionCategories = useMemo(() => {
    const categories: Record<string, ProductOption[]> = {
      unique: [],
      accompaniment: [],
      optional: [],
      quantity: []
    };

    productOptions.forEach(option => {
      if (option.min_choices === 1 && option.max_choices === 1) {
        categories.unique.push(option);
      } else if (option.id === 198950) {
        categories.accompaniment.push(option);
      } else if (option.max_choices > 1 && option.values.some(v => v.price > 0)) {
        categories.quantity.push(option);
      } else {
        categories.optional.push(option);
      }
    });

    return categories;
  }, [productOptions]);

  // Créer les default values dynamiques
  const getDefaultValues = useCallback((): FormValues => {
    const defaults: FormValues = {
      quantity: 1,
    };

    // Si on est en mode édition, charger les valeurs existantes
    if (isEditing && editItem) {
      defaults.quantity = editItem.quantity;

      // Charger les options existantes
      editItem.options.forEach((savedOption) => {
        const optionId = savedOption.id_zelty;
        const option = productOptions.find(opt => opt.id.toString() === optionId);

        if (option) {
          // Déterminer le type d'option
          if (option.min_choices === 1 && option.max_choices === 1) {
            defaults[`unique_${optionId}`] = [savedOption];
          } else if (option.id === 198950) {
            defaults[`accompaniment_${optionId}`] = [savedOption];
          } else if (option.max_choices > 1 && option.values.some(v => v.price > 0)) {
            defaults[`quantity_${optionId}`] = [savedOption];
          } else {
            defaults[`optional_${optionId}`] = [savedOption];
          }
        }
      });

      return defaults;
    }

    // Initialiser les options uniques avec la première valeur par défaut
    optionCategories.unique.forEach(option => {
      const defaultValue = option.values.find(v =>
        v.name?.toLowerCase().includes("al dente") ||
        v.name?.toLowerCase().includes("à point") ||
        v.name?.toLowerCase().includes("frites")
      );
      if (defaultValue) {
        defaults[`unique_${option.id}`] = [{
          name: option.name,
          id_zelty: option.id.toString(),
          details: [{
            id: defaultValue.id.toString(),
            name: defaultValue.name,
            price: defaultValue.price,
            qte: 1,
          }],
        }];
      } else if (option.values[0]) {
        defaults[`unique_${option.id}`] = [{
          name: option.name,
          id_zelty: option.id.toString(),
          details: [{
            id: option.values[0].id.toString(),
            name: option.values[0].name,
            price: option.values[0].price,
            qte: 1,
          }],
        }];
      } else {
        defaults[`unique_${option.id}`] = [];
      }
    });

    // Initialiser les accompagnements
    optionCategories.accompaniment.forEach(option => {
      defaults[`accompaniment_${option.id}`] = [];
    });

    // Initialiser les options optionnelles
    optionCategories.optional.forEach(option => {
      defaults[`optional_${option.id}`] = [];
    });

    // Initialiser les options avec quantité
    optionCategories.quantity.forEach(option => {
      defaults[`quantity_${option.id}`] = [];
    });

    return defaults;
  }, [optionCategories, isEditing, editItem, productOptions]);

  const form = useForm<FormValues>({
    defaultValues: getDefaultValues(),
  });

  // Calcul du prix total
  const calculateTotal = useCallback(() => {
    const values = form.getValues();
    let total = product.price;

    const processOptions = (optionGroup: SelectedOptionGroup[] | undefined) => {
      if (!optionGroup || !Array.isArray(optionGroup)) return;
      optionGroup.forEach((option: SelectedOptionGroup) => {
        if (option.details && Array.isArray(option.details)) {
          option.details.forEach((detail: SelectedOptionDetail) => {
            total += (detail.price || 0) * (detail.qte || 1);
          });
        }
      });
    };

    // Parcourir toutes les options
    Object.keys(values).forEach(key => {
      if (key !== 'quantity' && Array.isArray(values[key])) {
        processOptions(values[key]);
      }
    });

    return total;
  }, [form, product.price]);

  const [currentPrice, setCurrentPrice] = useState(XAF.format(product.price));

  // Mettre à jour le prix quand les options changent
  useEffect(() => {
    const subscription = form.watch(() => {
      const total = calculateTotal();
      const quantity = form.getValues().quantity;
      setCurrentPrice(XAF.format(total * quantity));

      // Valider les options
      validateOptions();
    });
    return () => subscription.unsubscribe();
  }, [form, calculateTotal]);

  // Validation des min_choices et max_choices
  const validateOptions = useCallback(() => {
    const values = form.getValues();
    const errors: Record<string, string> = {};

    // Valider les options uniques
    optionCategories.unique.forEach(option => {
      const selections = values[`unique_${option.id}`];
      if (!selections || !Array.isArray(selections) || selections.length < option.min_choices) {
        errors[`unique_${option.id}`] = `${option.name} : minimum ${option.min_choices} choix requis`;
      }
    });

    // Valider les accompagnements
    optionCategories.accompaniment.forEach(option => {
      const selections = values[`accompaniment_${option.id}`];
      const selectionsArray = Array.isArray(selections) ? selections : [];
      if (selectionsArray.length < option.min_choices) {
        errors[`accompaniment_${option.id}`] = `${option.name} : minimum ${option.min_choices} choix requis`;
      }
      if (selectionsArray.length > option.max_choices) {
        errors[`accompaniment_${option.id}`] = `${option.name} : maximum ${option.max_choices} choix autorisés`;
      }
    });

    // Valider les options optionnelles
    optionCategories.optional.forEach(option => {
      const selections = values[`optional_${option.id}`];
      const selectionsArray = Array.isArray(selections) ? selections : [];
      if (selectionsArray.length > option.max_choices) {
        errors[`optional_${option.id}`] = `${option.name} : maximum ${option.max_choices} choix autorisés`;
      }
    });

    // Valider les options avec quantité
    optionCategories.quantity.forEach(option => {
      const selections = values[`quantity_${option.id}`];
      const selectionsArray = Array.isArray(selections) ? selections : [];
      let totalQuantity = 0;
      selectionsArray.forEach((group: SelectedOptionGroup) => {
        if (group.details && Array.isArray(group.details)) {
          group.details.forEach((detail: SelectedOptionDetail) => {
            totalQuantity += detail.qte;
          });
        }
      });
      if (totalQuantity > option.max_choices) {
        errors[`quantity_${option.id}`] = `${option.name} : maximum ${option.max_choices} sélections autorisées`;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form, optionCategories]);

  useEffect(() => {
    if (!open) {
      form.reset(getDefaultValues());
      setValidationErrors({});
    }
  }, [open, form, getDefaultValues]);

  const UniqueOptionField = ({ option }: { option: ProductOption }) => {
    const fieldName = `unique_${option.id}`;
    const selections = form.watch(fieldName);
    const selectedId = selections?.[0]?.details?.[0]?.id;
    const selectedName = selections?.[0]?.details?.[0]?.name;

    return (
      <AccordionItem value={fieldName} className="border-b-0">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex flex-col items-start gap-1">
            <span className="font-bold text-base text-gray-900">{option.name}</span>
            <span className="text-sm text-gray-500 font-normal">
              {selectedName || "Sélectionnez une option"}
            </span>
          </div>
          <div className="flex items-center gap-2 mr-2">
            {option.min_choices > 0 && (
              <Badge variant="secondary" className="bg-amber-400 hover:bg-amber-500 text-gray-900 border-0 text-[10px] uppercase font-bold py-0.5 px-2">
                Requis
              </Badge>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem className="space-y-0">
                {validationErrors[fieldName] && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTitle>{validationErrors[fieldName]}</AlertTitle>
                  </Alert>
                )}
                <RadioGroup
                  value={selectedId || ""}
                  onValueChange={(value: string) => {
                    const selectedValue = option.values.find(v => v.id.toString() === value);
                    if (selectedValue) {
                      field.onChange([{
                        name: option.name,
                        id_zelty: option.id.toString(),
                        details: [{
                          id: selectedValue.id.toString(),
                          name: selectedValue.name,
                          price: selectedValue.price,
                          qte: 1,
                        }],
                      }]);
                    }
                  }}
                  className="flex flex-col gap-1"
                >
                  {option.values.map((value) => {
                    const isSelected = selectedId === value.id.toString();
                    return (
                      <div
                        key={value.id}
                        className={cn(
                          "flex w-full justify-between items-center py-3 px-4 rounded-lg cursor-pointer transition-colors group",
                          isSelected ? "bg-amber-50/50" : "hover:bg-gray-50"
                        )}
                        onClick={() => {
                          const selectedValue = option.values.find(v => v.id === value.id);
                          if (selectedValue) {
                            field.onChange([{
                              name: option.name,
                              id_zelty: option.id.toString(),
                              details: [{
                                id: selectedValue.id.toString(),
                                name: selectedValue.name,
                                price: selectedValue.price,
                                qte: 1,
                              }],
                            }]);
                          }
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={value.id.toString()} id={`${option.id}-${value.id}`} className="sr-only" />
                          <Label
                            htmlFor={`${option.id}-${value.id}`}
                            className={cn(
                              "text-[15px] font-normal cursor-pointer",
                              isSelected ? "text-gray-900 font-medium" : "text-gray-600"
                            )}
                          >
                            {value.name}
                          </Label>
                        </div>
                        <div className="flex items-center gap-3">
                          {value.price > 0 && (
                            <span className={cn(
                              "text-sm",
                              isSelected ? "text-gray-900 font-semibold" : "text-gray-500"
                            )}>
                              +{XAF.format(value.price)}
                            </span>
                          )}
                          {isSelected && <Check className="h-4 w-4 text-amber-500" />}
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionContent>
      </AccordionItem>
    );
  };

  const CheckboxOptionField = ({ option, isRequired = false }: { option: ProductOption; isRequired?: boolean }) => {
    const fieldName = option.id === 198950 ? `accompaniment_${option.id}` :
      optionCategories.optional.some(o => o.id === option.id) ? `optional_${option.id}` :
        `unique_${option.id}`;

    const currentSelections = form.watch(fieldName);
    const selectedCount = Array.isArray(currentSelections) ? currentSelections.length : 0;
    const selectedNames = Array.isArray(currentSelections)
      ? currentSelections.map((s: SelectedOptionGroup) => s.details?.[0]?.name).filter(Boolean).join(", ")
      : "";

    const canSelect = (checked: boolean): boolean => {
      if (checked) {
        return selectedCount < option.max_choices;
      }
      return true;
    };

    return (
      <AccordionItem value={fieldName} className="border-b-0">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex flex-col items-start gap-1">
            <span className="font-bold text-base text-gray-900">{option.name}</span>
            <span className="text-sm text-gray-500 font-normal">
              {selectedNames || (option.max_choices > 1 ? "Ajoutez un ou plusieurs" : "Sélectionnez une option")}
            </span>
          </div>
          <div className="flex items-center gap-2 mr-2">
            {isRequired && (
              <Badge variant="secondary" className="bg-amber-400 hover:bg-amber-500 text-gray-900 border-0 text-[10px] uppercase font-bold py-0.5 px-2">
                Requis
              </Badge>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-1">
            {validationErrors[fieldName] && (
              <Alert variant="destructive" className="mt-2">
                <AlertTitle>{validationErrors[fieldName]}</AlertTitle>
              </Alert>
            )}
            {option.values.map((value) => (
              <FormField
                key={value.id}
                control={form.control}
                name={fieldName}
                render={({ field }) => {
                  const currentValue = field.value;
                  const isChecked = Array.isArray(currentValue) && currentValue.some((el: SelectedOptionGroup) =>
                    el.details?.some((x: SelectedOptionDetail) => x.id === value.id.toString())
                  );

                  return (
                    <div
                      className={cn(
                        "flex w-full justify-between items-center py-3 px-4 rounded-lg cursor-pointer transition-colors group",
                        isChecked ? "bg-amber-50/50" : "hover:bg-gray-50"
                      )}
                      onClick={() => {
                        const isCheckedBool = !isChecked;
                        if (!canSelect(isCheckedBool)) {
                          if (isCheckedBool) {
                            toast({
                              title: "Limite atteinte",
                              description: `Vous ne pouvez choisir que ${option.max_choices} options.`,
                              variant: "destructive",
                            });
                          }
                          return;
                        }

                        const currentArray = Array.isArray(currentValue) ? currentValue : [];

                        if (isCheckedBool) {
                          field.onChange([
                            ...currentArray,
                            {
                              name: option.name,
                              id_zelty: option.id.toString(),
                              details: [{
                                id: value.id.toString(),
                                name: value.name,
                                price: value.price,
                                qte: 1,
                              }],
                            },
                          ]);
                        } else {
                          field.onChange(
                            currentArray.filter((el: SelectedOptionGroup) =>
                              !el.details?.some((x: SelectedOptionDetail) => x.id === value.id.toString())
                            )
                          );
                        }
                      }}
                    >
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            className="sr-only"
                            checked={isChecked}
                          />
                        </FormControl>
                        <FormLabel className={cn(
                          "text-[15px] font-normal cursor-pointer",
                          isChecked ? "text-gray-900 font-medium" : "text-gray-600"
                        )}>
                          {value.name}
                        </FormLabel>
                      </FormItem>
                      <div className="flex items-center gap-3">
                        {value.price > 0 && (
                          <span className={cn(
                            "text-sm",
                            isChecked ? "text-gray-900 font-semibold" : "text-gray-500"
                          )}>
                            +{XAF.format(value.price)}
                          </span>
                        )}
                        {isChecked && <Check className="h-4 w-4 text-amber-500" />}
                      </div>
                    </div>
                  );
                }}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  const QuantityOptionField = ({ option }: { option: ProductOption }) => {
    const fieldName = `quantity_${option.id}`;
    const selections = form.watch(fieldName);

    const getTotalQuantity = (): number => {
      const selectionsArray = Array.isArray(selections) ? selections : [];
      let total = 0;
      selectionsArray.forEach((group: SelectedOptionGroup) => {
        if (group.details && Array.isArray(group.details)) {
          group.details.forEach((detail: SelectedOptionDetail) => {
            total += detail.qte;
          });
        }
      });
      return total;
    };

    const selectedSummary = Array.isArray(selections)
      ? selections.map((s: SelectedOptionGroup) =>
        s.details?.map(d => `${d.qte}x ${d.name}`).join(", ")
      ).filter(Boolean).join(", ")
      : "";

    return (
      <AccordionItem value={fieldName} className="border-b-0">
        <AccordionTrigger className="hover:no-underline py-4">
          <div className="flex flex-col items-start gap-1">
            <span className="font-bold text-base text-gray-900">{option.name}</span>
            <span className="text-sm text-gray-500 font-normal">
              {selectedSummary || "Ajoutez un ou plusieurs"}
            </span>
          </div>
          <div className="flex items-center gap-2 mr-2">
            {option.min_choices > 0 && (
              <Badge variant="secondary" className="bg-amber-400 hover:bg-amber-500 text-gray-900 border-0 text-[10px] uppercase font-bold py-0.5 px-2">
                Requis
              </Badge>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-1">
            {validationErrors[fieldName] && (
              <Alert variant="destructive" className="mt-2">
                <AlertTitle>{validationErrors[fieldName]}</AlertTitle>
              </Alert>
            )}
            {option.values.map((value) => (
              <div
                key={value.id}
                className="flex w-full justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <FormField
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => {
                    const currentValue = field.value;
                    const currentArray = Array.isArray(currentValue) ? currentValue : [];
                    const optionIndex = currentArray.findIndex(
                      (val: SelectedOptionGroup) => val.name === option.name
                    );
                    const detailIndex = optionIndex !== -1 && currentArray[optionIndex]?.details
                      ? currentArray[optionIndex].details.findIndex(
                        (dt: SelectedOptionDetail) => dt.id === value.id.toString()
                      )
                      : -1;
                    const currentQuantity = detailIndex >= 0 && optionIndex !== -1
                      ? currentArray[optionIndex].details[detailIndex].qte
                      : 0;

                    const canAdd = (): boolean => {
                      const totalQuantity = getTotalQuantity();
                      return totalQuantity < option.max_choices;
                    };

                    return (
                      <div className="flex flex-1 justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-row gap-2 items-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full border-gray-200"
                              onClick={(e) => {
                                e.preventDefault();
                                if (detailIndex !== -1 && optionIndex !== -1) {
                                  const newValue = [...currentArray];
                                  if (currentQuantity > 1) {
                                    newValue[optionIndex].details[detailIndex].qte -= 1;
                                  } else {
                                    newValue[optionIndex].details.splice(detailIndex, 1);
                                    if (newValue[optionIndex].details.length === 0) {
                                      newValue.splice(optionIndex, 1);
                                    }
                                  }
                                  field.onChange(newValue);
                                }
                              }}
                              disabled={currentQuantity === 0}
                            >
                              <Minus size={14} className="text-primary" />
                            </Button>
                            <span className="w-6 text-center font-semibold text-gray-900">{currentQuantity}</span>
                            <Button
                              type="button"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              disabled={!canAdd()}
                              onClick={(e) => {
                                e.preventDefault();
                                const totalQuantity = getTotalQuantity();

                                if (optionIndex === -1 && totalQuantity < option.max_choices) {
                                  field.onChange([...currentArray, {
                                    name: option.name,
                                    id_zelty: option.id.toString(),
                                    details: [{
                                      id: value.id.toString(),
                                      name: value.name,
                                      price: value.price,
                                      qte: 1,
                                    }],
                                  }]);
                                } else if (detailIndex === -1 && totalQuantity < option.max_choices && optionIndex !== -1) {
                                  const newValue = [...currentArray];
                                  if (!newValue[optionIndex].details) {
                                    newValue[optionIndex].details = [];
                                  }
                                  newValue[optionIndex].details.push({
                                    id: value.id.toString(),
                                    name: value.name,
                                    price: value.price,
                                    qte: 1,
                                  });
                                  field.onChange(newValue);
                                } else if (detailIndex !== -1 && totalQuantity < option.max_choices && optionIndex !== -1) {
                                  const newValue = [...currentArray];
                                  newValue[optionIndex].details[detailIndex].qte += 1;
                                  field.onChange(newValue);
                                }
                              }}
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                          <span className={cn(
                            "text-[15px] font-normal",
                            currentQuantity > 0 ? "text-gray-900 font-medium" : "text-gray-600"
                          )}>
                            {value.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {value.price > 0 && (
                            <span className={cn(
                              "text-sm",
                              currentQuantity > 0 ? "text-gray-900 font-semibold" : "text-gray-500"
                            )}>
                              +{XAF.format(value.price)}
                            </span>
                          )}
                          {currentQuantity > 0 && <Check className="h-4 w-4 text-amber-500" />}
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  const onSubmit = useCallback((data: FormValues) => {
    if (!validateOptions()) {
      toast({
        title: "Options incomplètes",
        description: "Veuillez remplir toutes les options obligatoires",
        variant: "destructive",
      });
      return;
    }

    // Récupérer toutes les options sélectionnées
    const selectedOptions: SelectedOptionGroup[] = [];
    Object.keys(data).forEach(key => {
      if (key !== 'quantity' && Array.isArray(data[key]) && data[key].length > 0) {
        selectedOptions.push(...data[key]);
      }
    });

    const totalPrice = calculateTotal();
    const finalPrice = totalPrice * data.quantity;

    if (isEditing && editItem) {
      // Mode édition : mettre à jour l'article existant
      updateCartItem(Number(editItem.id),
        {
          quantity: data.quantity,
          options: selectedOptions,
          price: finalPrice,
          id: editItem.id,
          name: product.name,
          item_id: product.id,
          image: product.image || "/images/imagePlaceholder.svg",
          tags: product.tags || []
        });

      toast({
        title: "Panier mis à jour !",
        description: (
          <Link href="/panier">
            <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {data.quantity} × {product.name} (modifié)
              </code>
            </div>
          </Link>
        ),
      });

      if (onEditComplete) {
        onEditComplete();
      }
    } else {
      // Mode ajout normal
      addToCart({
        id: `${product.id}_${Date.now()}`,
        quantity: data.quantity,
        name: product.name,
        item_id: product.id,
        options: selectedOptions,
        price: finalPrice,
        image: product.image || "/images/imagePlaceholder.svg",
        tags: product.tags || []
      });

      toast({
        title: "Ajouté au panier !",
        description: (
          <Link href="/panier">
            <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {data.quantity} × {product.name}
              </code>
            </div>
          </Link>
        ),
      });
    }

    setOpen(false);

    if (!isEditing) {
      router.push("/panier");
    }
  }, [addToCart, updateCartItem, product, calculateTotal, router, validateOptions, isEditing, editItem, onEditComplete]);

  const hasOptions = useMemo(() => {
    return productOptions.length > 0;
  }, [productOptions]);

  // Réinitialiser le formulaire quand on ouvre en mode édition
  useEffect(() => {
    if (open && isEditing && editItem) {
      form.reset(getDefaultValues());
    }
  }, [open, isEditing, editItem, form, getDefaultValues]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[85vh] flex flex-col">
        <DialogHeader className="sticky top-0 bg-white z-20 pb-2">
          <DialogTitle className="relative py-5 min-h-[144px] flex items-center">
            <div className="absolute w-full h-full bg-linear-to-t from-black/40 to-black/80 -z-10" />
            <img
              src={product.image || "/images/imagePlaceholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover absolute -z-20"
              loading="lazy"
            />
            <span className="px-4 text-white font-sans">
              {isEditing ? `Modifier : ${product.name}` : product.name}
            </span>
          </DialogTitle>
          <DialogDescription className="text-black text-[16px] text-center line-clamp-3">
            {product.description}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col overflow-y-auto flex-1">
            {hasOptions && (
              <div className="flex flex-col w-full pb-4 px-4 flex-1 overflow-y-auto my-scrollbox">
                <Accordion type="multiple" className="w-full" defaultValue={
                  isEditing && editItem ? editItem.options.map(opt => {
                    const option = productOptions.find(o => o.id.toString() === opt.id_zelty);
                    if (option) {
                      if (option.min_choices === 1 && option.max_choices === 1) return `unique_${opt.id_zelty}`;
                      if (option.id === 198950) return `accompaniment_${opt.id_zelty}`;
                      if (option.max_choices > 1 && option.values.some(v => v.price > 0)) return `quantity_${opt.id_zelty}`;
                      return `optional_${opt.id_zelty}`;
                    }
                    return "";
                  }).filter(Boolean) : undefined
                }>
                  {/* Options uniques (Radio) */}
                  {optionCategories.unique.map((option) => (
                    <UniqueOptionField key={option.id} option={option} />
                  ))}

                  {/* Accompagnement (Checkbox avec min/max) */}
                  {optionCategories.accompaniment.map((option) => (
                    <CheckboxOptionField key={option.id} option={option} isRequired={option.min_choices > 0} />
                  ))}

                  {/* Options optionnelles (Checkbox avec max) */}
                  {optionCategories.optional.map((option) => (
                    <CheckboxOptionField key={option.id} option={option} isRequired={false} />
                  ))}

                  {/* Options avec quantité (Burger/Pizza) */}
                  {optionCategories.quantity.map((option) => (
                    <QuantityOptionField key={option.id} option={option} />
                  ))}
                </Accordion>
              </div>
            )}

            <div className="flex items-center gap-4 p-4 border-t bg-white sticky bottom-0">
              <div className="flex items-center gap-3 bg-gray-100 p-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => form.setValue("quantity", Math.max(1, (form.getValues().quantity || 1) - 1))}
                >
                  <Minus size={18} />
                </Button>
                <span className="w-8 text-center font-bold text-lg">{form.watch("quantity") || 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 bg-amber-400 hover:bg-amber-500 text-gray-900"
                  onClick={() => form.setValue("quantity", (form.getValues().quantity || 1) + 1)}
                >
                  <Plus size={18} />
                </Button>
              </div>
              <Button type="submit" size="lg" className="flex-1 bg-[#29235C] hover:bg-[#1e1a44] text-white font-bold h-12 flex justify-between px-6">
                <span>{isEditing ? "Mettre à jour" : "Ajouter"}</span>
                <span>{currentPrice}</span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddDialog;