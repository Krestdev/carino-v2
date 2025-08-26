"use client"

import React from 'react'
import z from 'zod/v3';
import { Dialog, DialogClose, DialogContent, DialogHeader } from '../ui/dialog';
import { AlertCircle, CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useStore from '@/context/store';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string({ required_error: "Veuillez entrer votre nom" }).min(4, "Trop court"),
  email: z.string().email({ message: "Adresse mail invalide" }),
  date: z.date({ required_error: "Veuillez choisir une date" }),
  time: z.string({ required_error: "Selectionnez une heure" }),
  menu: z.string({ required_error: "Veuillez choisir un menu pour continuer" }),
  places: z
    .string({ required_error: "Veuillez choisir le nombre de places" })
    .refine((value) => /^\d*$/.test(value)),

  salle: z.string(),
  phone: z
    .string({ required_error: "Veuillez entrer votre numéro de téléphone" })
    .refine((value) => /^\d*$/.test(value), {
      message: "Le numéro ne doit comporter que des chiffres",
    }),
  description: z.string(),
}).refine(data => {
  const [hours] = data.time.split(":");

  if (Number(hours) < 12 || Number(hours) > 21) {
    return false
  }
  return true;
}, { message: "Les réservations sont disponibles entre Midi et 22h", path: ["time"] });


const ReservationForm = () => {

  const { user } = useStore();
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      phone: user?.phone.substring(4),
      salle: "",
      // menu: selectedMenu ? selectedMenu : undefined
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (user) {
      // mutate(values);
      console.log(values);
      
    } else {
      setOpen(true);
    }
  }

  return (
    <div className='flex flex-col gap-8 max-w-[1040px] w-full mx-auto my-20'>
      <div className="max-w-[640px] w-full mx-auto spaced flex flex-col gap-10">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="p-5 flex flex-col gap-5">
            <DialogHeader className="uppercase tracking-widest pb-3 border-b">
              <span className="inline-flex gap-2 items-center">
                <AlertCircle size={32} className="text-red-400" />
                {"Connexion requise"}
              </span>
            </DialogHeader>
            <p className="text-sm pb-5">
              {"Vous devez être connecté pour réserver au restaurant !"}<br />
              {`Si vous ne disposez pas de compte sur notre site veuillez vous `}
              <Link href="/inscription" className="font-semibold text-primary">
                {"inscrire"}
              </Link>
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              <Link href="/connexion">
                <Button variant={"outline"}>{"se connecter"}</Button>
              </Link>
              <DialogClose asChild>
                <Button variant={"destructive"}>{"Fermer"}</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
        {/* <Dialog open={successModal} onOpenChange={setSuccessModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-sans font-semibold tracking-tighter">{"Réservation enregistrée"}</DialogTitle>
              <DialogDescription>{`Votre réservation a été enregistrée avec succès, vous serez très prochainement contacté par nos services pour confirmer votre demande`}</DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <Button>{"Fermer"}</Button>
            </DialogClose>
          </DialogContent>
        </Dialog> */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-screen-md w-full px-7 mx-auto flex flex-col gap-7"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Nom de la réservation"}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Adresse mail"}</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Date de la réservation"}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 h-10 text-left font-normal normal-case tracking-normal border-input hover:bg-input text-[14px] text-current bg-background",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            field.value.toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "long",

                              day: "numeric",
                            })
                          ) : (
                            <span>{"Choisir une date"}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={
                          (date) => date < new Date()
                          //date < new Date(new Date().setDate(new Date().getDate() + 14))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Heure"}</FormLabel>
                  <Input type="time" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="menu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Menu"}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Choissisez un menu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* {buffets.map(buffet =>
                      <SelectItem key={buffet.value} value={buffet.value}>{buffet.name}</SelectItem>
                    )} */}
                      <SelectItem value="custom">{"Menu personnalisé"}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {/* {buffets
                    .filter((buffet) => buffet.value === field.value)
                    .map((buffet, id) => (
                      <ModalMenu key={id} {...buffet} />
                    ))} */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="places"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Nombre de places"}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      min={2}
                      max={100}
                      placeholder="2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Salle"}</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Choissisez une salle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="terrasse">{"Espace Fumeur"}</SelectItem>
                      <SelectItem value="intérieure">
                        {"Espace Non-Fumeur"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{"Numéro de téléphone"}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} placeholder="ex. 678890890" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Commentaires"}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez-nous votre menu"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
            // disabled={isPending}
            // onClick={(e) => { e.preventDefault(); setConfirm(true) }}
            >
              {"Soumettre ma réservation"}
            </Button>
            {/* <Dialog open={confirm} onOpenChange={setConfirm}>
            <DialogContent>
              <DialogHeader className="bg-primary text-gray-900">
                <DialogTitle className="font-sans font-semibold tracking-tighter">{"Confirmer la réservation"}</DialogTitle>
                <DialogDescription className="text-gray-800">{"Vérifiez les informations liées à votre réservation"}</DialogDescription>
              </DialogHeader>
              <div className="px-7 pb-7 grid gap-4">
                <div className="grid gap-2">
                  <span className="text-sm text-gray-400">{"Nom de la réservation"}</span>
                  <p>{!!form.getValues("name") && form.getValues("name")}</p>
                </div>
                <div className="grid gap-2">
                  <span className="text-sm text-gray-400">{"Votre adresse mail"}</span>
                  <p>{!!form.getValues("email") && form.getValues("email")}</p>
                </div>
                <div className="grid gap-2">
                  <span className="text-sm text-gray-400">{"Date de la réservation"}</span>
                  <p>{!!form.getValues("booking_for") && format(new Date(form.getValues("booking_for")), "PPP", { locale: fr })} {form.getValues("time")}</p>
                </div>
                <div className="grid gap-2">
                  <span className="text-sm text-gray-400">{"Menu"}</span>
                  <p>{!!form.getValues("menu") && form.getValues("menu")} pour {form.getValues("places")} personnes</p>
                </div>
                <div className="grid gap-2">
                  <span className="text-sm text-gray-400">{"Téléphone"}</span>
                  <p>{!!form.getValues("country_code") && form.getValues("country_code")} {!!form.getValues("phone") && form.getValues("phone")}</p>
                </div>
                <div className="grid gap-2">
                  <span className="text-sm text-gray-400">{"Commentaires"}</span>
                  <p>{!!form.getValues("comment") && form.getValues("comment")}</p>
                </div>
                <div className="inline-flex gap-2">
                  <Button type="submit" onClick={(e) => { e.preventDefault(); form.handleSubmit(onSubmit)(); setConfirm(false) }}>{"Confirmer"}</Button>
                  <Button className="w-fit" variant={"outline"} onClick={(e) => { e.preventDefault(); setConfirm(false) }}>{"Annuler"}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog> */}
          </form>
        </Form>
      </div>
      <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4077844.007903163!2d11.0906982!3d3.525072!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf3b75e0d501%3A0x71a28a857f271156!2sLe%20Carino%20Pizzeria!5e0!3m2!1sfr!2scm!4v1756116288352!5m2!1sfr!2scm" width="full" height="310" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
    </div>
  )
}

export default ReservationForm
