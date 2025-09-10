import Homebutton from "@/components/Privacy/homebutton";
import Head from "@/components/universal/Head";
import { Home, Mail, Phone } from "lucide-react";
import Link from "next/link";
import React from "react";

const Page = () => {
    return (
        <div>
            <Head image={"/tempo/pub1.webp"} title="Termes & Conditions" />
            <div className="pb-24 max-w-[1440px] w-full mx-auto">
                <Homebutton />

                <div className="container mx-auto  flex flex-col gap-4 p-7 pt-5 lg:p-3">
                    {/* <h3 className="text-center">Termes & Conditions</h3> */}
                    <div className="text-left flex flex-col gap-3  ml:2 ">
                        <div>
                            <h3>1- Introduction</h3>
                            <p>
                                Bienvenue sur le site web de Le Carino Pizzeria. En accédant à notre site et en utilisant nos services, vous acceptez de vous conformer aux termes et conditions suivants. Veuillez lire attentivement ces termes avant d'utiliser notre site
                            </p>
                        </div>
                        <div>
                            <h3>2- Acceptation des termes</h3>
                            <p>En utilisant ce site, vous acceptez d'être lié par ces termes et conditions, ainsi que par toutes les lois et réglementations applicables. Si vous n'acceptez pas ces termes, veuillez ne pas utiliser notre site.</p>
                        </div>
                        <div>
                            <h3>3- Utilisation du site</h3>
                            <p>
                                Vous êtes autorisé à utiliser notre site uniquement à des fins légales et conformément à ces termes et conditions. Vous acceptez de ne pas utiliser le site :
                            </p>
                            <ul className=" list-disc ml-4">
                                <li>
                                    <p>
                                        Pour enfreindre toute loi ou réglementation locale, nationale ou internationale applicable.
                                    </p>
                                </li>
                                <li>
                                    <p>Pour envoyer ou recevoir sciemment tout matériel qui ne respecte pas nos normes de contenu.</p>
                                </li>
                                <li>
                                    <p>
                                        Pour transmettre ou obtenir l'envoi de tout matériel publicitaire ou promotionnel non sollicité ou non autorisé.
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3>4- Commandes et Paiements</h3>
                            <ul className=" list-disc ml-4">
                                <li>
                                    <p>Passation de Commandes : En passant une commande sur notre site, vous confirmez que vous avez lu et accepté nos termes et conditions. Toutes les commandes sont sujettes à la disponibilité des produits et à notre acceptation.</p>
                                </li>
                                <li>
                                    <p>Prix et Paiements : Les prix affichés sur notre site sont en euros et incluent la TVA. Nous nous réservons le droit de modifier les prix à tout moment. Le paiement doit être effectué en totalité au moment de la commande via les méthodes de paiement disponibles sur notre site.</p>
                                </li>
                                <li>
                                    <p>
                                        Confirmation de Commande : Une fois que vous avez passé une commande, vous recevrez un email de confirmation contenant les détails de votre commande. Cette confirmation ne constitue pas une acceptation de votre commande. Nous nous réservons le droit de refuser une commande pour des raisons telles que la disponibilité des produits, des erreurs dans les informations de commande ou des problèmes de paiement.
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3>5-Livraison</h3>
                            <ul className=" list-disc ml-4">
                                <li>
                                    <p>
                                        Zone de Livraison : Nous livrons uniquement dans certaines zones géographiques spécifiées sur notre site. Veuillez vérifier que votre adresse est éligible pour la livraison avant de passer une commande.
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Délai de Livraison : Nous faisons de notre mieux pour livrer les commandes dans les délais indiqués, mais nous ne pouvons pas garantir une heure de livraison précise. Des retards peuvent survenir en raison de conditions imprévues.
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Frais de Livraison : Les frais de livraison sont indiqués lors de la commande et peuvent varier en fonction de la zone de livraison.
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3>6- Annulations et Retours</h3>
                            <ul className=" list-disc ml-4">
                                <li>
                                    <p>Annulations : Vous pouvez annuler une commande dans un délai raisonnable avant son traitement. Une fois la commande en cours de préparation ou expédiée, elle ne peut plus être annulée.</p>
                                </li>
                                <li>
                                    <p>Retours et Remboursements : En raison de la nature périssable de nos produits, nous n'acceptons pas les retours. Si vous recevez un produit incorrect ou endommagé, veuillez nous contacter immédiatement pour une résolution appropriée.</p>
                                </li>
                            </ul>

                        </div>
                        <div>
                            <h3>7- Propriété intellectuelle</h3>
                            <p>
                                Tout le contenu présent sur ce site, y compris les textes, images, logos et graphiques, est la propriété de Le Carino Pizzeria ou de ses fournisseurs de contenu et est protégé par les lois sur le droit d'auteur et autres lois sur la propriété intellectuelle. Vous ne pouvez pas reproduire, distribuer ou utiliser ce contenu sans notre autorisation préalable écrite.
                            </p>
                        </div>
                        <div>
                            <h3>8- Limitation de responsabilité</h3>
                            <p>
                                Le Carino Pizzeria ne sera pas responsable des dommages directs, indirects, accessoires, consécutifs ou punitifs résultant de votre utilisation de ce site ou des produits achetés via ce site, y compris, mais sans s'y limiter, les erreurs, omissions ou inexactitudes dans le contenu, les interruptions de service, ou les pertes de données.
                            </p>
                        </div>
                        <div>
                            <h3>9- Modifications des Termes</h3>
                            <p>
                                Nous nous réservons le droit de modifier ces termes et conditions à tout moment. Toute modification sera effective dès sa publication sur ce site. Nous vous encourageons à consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.
                            </p>
                        </div>
                        <div>
                            <h3>10- Droit Applicable</h3>
                            <p>
                                Ces termes et conditions sont régis et interprétés conformément aux lois camerounaises. Tout litige découlant de ou en relation avec ces termes sera soumis à la juridiction exclusive des tribunaux de Douala.
                            </p>
                        </div>
                        <div>
                            <h3>11- Contactez-nous</h3>
                            <p>
                                Pour toute question relative à la gestion de vos données
                                personnelles :
                            </p>
                            <div className="space-y-2">
                                <Link href="mailto:info@le-carino.com" className="flex gap-2">
                                    <Mail color="#CECECE" /> Email : info@le-carino.com
                                </Link>
                                <Link href="tel:+237696541055" className="flex gap-2">
                                    <Phone color="#CECECE" /> Téléphone : +237 696 54 10 55
                                </Link>
                                <Link href="https://www.google.com/maps/place/Playce+Warda/@3.8444986,11.5126974,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d3.8444986!4d11.5126974" className=" flex items-center gap-2">
                                    <Home color="#CECECE" />{" "}
                                    <span>Adresse : Playce Warda, Yaoundé, Cameroun</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
