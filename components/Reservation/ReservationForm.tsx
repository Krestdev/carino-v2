"use client";

import React, { useState } from "react";
import z from "zod/v3";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { AlertCircle, Loader } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useStore from "@/context/store";
import { Textarea } from "../ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { toast } from "../ui/use-toast";
import { useAppContext } from "@/providers/appContext";
import ReservationQuery from "@/queries/bookingsQuery";
import { DatePicker } from "../ui/date-picker";
import { TimePicker } from "../ui/time-picker";
import { User } from "@/types/types";

const formSchema = z
  .object({
    name: z
      .string({ required_error: "Veuillez entrer votre nom" })
      .min(4, "Trop court"),

    date: z.date({ required_error: "Veuillez choisir une date" }).refine(
      (date) => {
        // Aujourd'hui à minuit
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Demain à minuit
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Vérifie que la date choisie >= demain
        return date >= tomorrow;
      },
      {
        message: "La réservation doit être faite à partir de demain",
      }
    ),

    time: z.date({ required_error: "Sélectionnez une heure" })
      .refine((date) => {
        return date instanceof Date && !isNaN(date.getTime());
      }, {
        message: "Heure invalide"
      }),

    places: z
      .string({ required_error: "Veuillez choisir le nombre de places" })
      .refine((value) => /^\d*$/.test(value), {
        message: "Le nombre de places doit être un nombre",
      }),

    phone: z
      .string({ required_error: "Veuillez entrer votre numéro de téléphone" })
      .refine((value) => /^\d*$/.test(value), {
        message: "Le numéro ne doit comporter que des chiffres",
      }),

    comment: z.string(),
  })
  .refine(
    (data) => {
      const hours = data.time?.getHours();

      // Réservations seulement entre 12h et 22h inclus
      return Number(hours) >= 12 && Number(hours) <= 21;
    },
    {
      message: "Les réservations sont disponibles entre Midi et 22h",
      path: ["time"],
    }
  );

const ReservationForm = () => {
  const { user } = useStore();
  const [open, setOpen] = React.useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const { setOpenLogSign, } = useStore();

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL2 || "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name,
      phone: user?.phone ? user?.phone.substring(4) : "",
      comment: "",
      places: "",
      time: new Date(),
      date: new Date(),
    },
  });

  const reservation = new ReservationQuery(baseURL)
  const reservationData = useMutation({
    mutationKey: ["reservations"],
    mutationFn: (data: z.infer<typeof formSchema>) =>
      reservation.createReservation({
        places: Number(data.places),
        comment: data.comment,
        id_customer: user?.id!,
        customer: user as User,
        booking_for: data.date.toISOString()
      }),
    onSuccess: () => {
      setSuccessModal(true);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la réservation",
        variant: "destructive",
      });
    }
  });

  const isValidDate = (date: Date) => {
    const today = new Date();
    return date > today;
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (user) {
      if (isValidDate(values.date)) {
        reservationData.mutate(values);
      } else {

        toast({
          title: "Date invalide",
          description: "Veuillez choisir une date future",
          variant: "destructive",
        });
      }
    } else {
      setOpen(true);
    }
  }

  return (
    <div className="flex flex-col gap-3 md:gap-0 md:flex-row justify-center items-center md:items-end max-w-[768px] w-full md:mx-auto mb-10">
      <div className="flex flex-col items-center gap-10 w-full px-7 py-10 md:py-24">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="p-5 flex flex-col gap-5">
            <DialogHeader className="uppercase tracking-widest pb-3 border-b">
              <span className="inline-flex gap-2 items-center">
                <AlertCircle size={32} className="text-red-400" />
                {"Connexion requise"}
              </span>
            </DialogHeader>
            <p className="text-sm pb-5">
              {"Vous devez être connecté pour réserver au restaurant !"}
              <br />
              {`Si vous ne disposez pas de compte sur notre site veuillez vous `}
              <Button onClick={() => setOpenLogSign(true)} variant={"link"} className="font-semibold text-primary">
                {"inscrire"}
              </Button>
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              <Button onClick={() => setOpenLogSign(true)} variant={"outline"} className="text-black">
                {"se connecter"}
              </Button>
              <DialogClose asChild>
                <Button variant={"destructive"}>{"Fermer"}</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={successModal} onOpenChange={setSuccessModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-sans font-semibold tracking-tighter">
                {"Réservation enregistrée"}
              </DialogTitle>
              <DialogDescription>{`Votre réservation a été enregistrée avec succès, vous serez très prochainement contacté par nos services pour confirmer votre demande`}</DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <Button>{"Fermer"}</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nom */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {"Nom complet"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ex. Jean Atangana" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {"Votre numéro de téléphone"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ex. 237 6 93 00 00 00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {"Votre date de réservation"}
                    </FormLabel>
                    <FormControl>
                      <DatePicker placeholder={"--/--/--"} value={field.value} onChangeValue={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Heure */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {"Votre heure de réservation"}
                    </FormLabel>
                    <FormControl>
                      <TimePicker placeholder={"--:--"} value={field.value} onChangeValue={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Places */}
              <FormField
                control={form.control}
                name="places"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {"Personnes"}
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex. 4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Commentaire */}
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      {"Commentaire"}
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex. 4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <Button
              type="button"
              disabled={reservationData.isPending}
              // disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                setConfirm(true);
              }}
              className="w-fit"
            >
              {reservationData.isPending && (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              )}
              {"Soumettre ma réservation"}
            </Button>
          </form>
          <Dialog open={confirm} onOpenChange={setConfirm}>
            <DialogContent>
              <DialogHeader className="bg-primary text-white p-2">
                <DialogTitle className="font-sans font-semibold tracking-tighter">
                  {"Confirmer la réservation"}
                </DialogTitle>
                <DialogDescription className="text-white">
                  {"Vérifiez les informations liées à votre réservation"}
                </DialogDescription>
              </DialogHeader>
              <div className="px-7 pb-7 grid gap-4">
                <div className="grid gap-2">
                  <span className="text-sm text-gray-400">
                    {"Nom de la réservation"}
                  </span>
                  <p>{!!form.getValues("name") && form.getValues("name")}</p>
                </div>
                <div className="grid gap-2">
                  <span className="text-sm text-gray-400">
                    {"Date de la réservation"}
                  </span>
                  <p>
                    {!!form.getValues("date") &&
                      format(new Date(form.getValues("date")), "PPP", {
                        locale: fr,
                      })}{" à "}
                    {!!form.getValues("time") &&
                      format(new Date(form.getValues("time")), "HH:mm", {
                        locale: fr,
                      })}
                  </p>
                </div>
                <div className="grid gap-2">
                  <span className="text-sm text-gray-400">{"Menu"}</span>
                  <p>
                    Pour{" "}
                    {form.getValues("places")} personnes
                  </p>
                </div>
                <div className="grid gap-2">
                  <span className="text-sm text-gray-400">{"Téléphone"}</span>
                  <p>{!!form.getValues("phone") && form.getValues("phone")}</p>
                </div>
                <div className="grid gap-2">
                  <span className="text-sm text-gray-400">
                    {"Commentaires"}
                  </span>
                  <p>
                    {!!form.getValues("comment") && form.getValues("comment")}
                  </p>
                </div>
                <div className="inline-flex gap-2">
                  <Button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                      setConfirm(false);
                    }}
                  >
                    {"Confirmer"}
                  </Button>
                  <Button
                    className="w-fit text-black border-black"
                    variant={"outline"}
                    onClick={(e) => {
                      e.preventDefault();
                      setConfirm(false);
                    }}
                  >
                    {"Annuler"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </Form>
      </div>
    </div>
  );
};

export default ReservationForm;
