import Homebutton from "@/components/Privacy/homebutton";
import PrivacyHero from "@/components/Privacy/PrivacyHero";
import { Home, Mail, Phone } from "lucide-react";
import React from "react";

const Page = () => {
  return (
    <div>
        <Head image={'/tempo/pub1.webp'} title='Politique & Confidentialité' />
      <div className="pb-24 max-w-[1440px] w-full mx-auto">
        <Homebutton />

      <div className="container mx-auto  flex flex-col gap-4 p-7   lg:p-3">
        <h3 className="text-center">Politique & confidentialité</h3>
        <div className="text-left flex flex-col gap-3  ml:2 ">
          <div>
            <h4>1. Données collectées</h4>
            <p>
              Nous collectons uniquement les données nécessaires à la fourniture
              de nos services :
            </p>
            <ul className=" list-disc ml-4  ">
              <li>
                <p>
                  Données d’identification : nom, prénom, adresse email, numéro
                  de téléphone, adresse de livraison.
                </p>
              </li>
              <li>
                <p>
                  Données de commande : historique des commandes, préférences
                  alimentaires.
                </p>
              </li>
              <li>
                <p>
                  Données de paiement : traitées par nos prestataires sécurisés
                  (nous ne stockons pas vos informations bancaires).
                </p>
              </li>
              <li>
                <p>
                  Données techniques : adresse IP, type de navigateur,
                  statistiques de navigation (cookies).
                </p>
              </li>
            </ul>
          </div>
          <div>
            <h4>2. Finalités de la collecte</h4>
            <p>Vos données personnelles sont utilisées uniquement pour :</p>
            <ul className=" list-disc ml-4">
              <li>
                <p>gérer vos commandes et réservations,</p>
              </li>
              <li>
                <p>assurer la livraison de vos repas,</p>
              </li>
              <li>
                <p>
                  vous contacter en cas de problème ou d’information relative à
                  votre commande,
                </p>
              </li>
              <li>
                <p>améliorer nos services et notre site internet,</p>
              </li>
              <li>
                <p>
                  vous informer sur nos offres, promotions ou événements (si
                  vous y avez consenti).
                </p>
              </li>
            </ul>
          </div>
          <div>
            <h4>3. Partage des données</h4>
            <p>
              Nous ne vendons ni ne louons vos données personnelles. Elles
              peuvent être partagées uniquement avec :
            </p>
            <ul className=" list-disc ml-4">
              <li>
                <p>
                  nos partenaires de paiement en ligne (prestataires sécurisés),
                </p>
              </li>
              <li>
                <p>nos services de livraison,</p>
              </li>
              <li>
                <p>
                  nos prestataires techniques (hébergeur, outils de gestion du
                  site).
                </p>
              </li>
              <p>
                Tous nos partenaires sont tenus de respecter la confidentialité
                de vos informations.
              </p>
            </ul>
          </div>
          <div>
            <h4>4. Cookies</h4>
            <p>Notre site utilise des cookies pour :</p>
            <ul className=" list-disc ml-4">
              <li>
                <p>améliorer votre expérience de navigation,</p>
              </li>
              <li>
                <p>mémoriser vos préférences (panier, langue, etc.)</p>
              </li>
              <li>
                <p>
                  analyser la fréquentation du site (Google Analytics ou
                  équivalent).
                </p>
              </li>
              <p>
                Vous pouvez à tout moment configurer votre navigateur pour
                refuser les cookies.
              </p>
            </ul>
          </div>
          <div></div>
          <div>
            <h4>5. Durée de conservation</h4>
            <ul className=" list-disc ml-4">
              <li>
                <p>
                  Les données liées à vos commandes sont conservées pendant la
                  durée légale nécessaire à des fins comptables et fiscales.
                </p>
              </li>
              <li>
                <p>
                  Les données marketing (inscription à la newsletter) sont
                  conservées jusqu’à votre désinscription
                </p>
              </li>
              <li>
                <p>
                  Les cookies peuvent être conservés jusqu’à 13 mois maximum.
                </p>
              </li>
            </ul>
          </div>
          <div>
            <h4>6. Sécurité des données</h4>
            <p>
              Nous mettons en place des mesures techniques et organisationnelles
              adaptées pour protéger vos données contre :
            </p>
            <ul className=" list-disc ml-4">
              <li>
                <p>tout accès non autorisé,</p>
              </li>
              <li>
                <p>toute modification, divulgation ou destruction.</p>
              </li>
            </ul>
            <p>
              Les paiements en ligne sont sécurisés via un protocole de cryptage
              (SSL/HTTPS).
            </p>
          </div>
          <div>
            <h4>7. Vos droits</h4>
            <p>
              Conformément à la législation en vigueur au Cameroun, vous
              disposez des droits suivants :
            </p>
            <ul className=" list-disc ml-4">
              <li>
                <p>droit d’accès à vos données,</p>
              </li>
              <li>
                <p>droit de rectification,</p>
              </li>
              <li>
                <p>droit de suppression,</p>
              </li>
              <li>
                <p>droit d’opposition à leur traitement,</p>
              </li>
              <li>
                <p>droit de portabilité (dans certains cas).</p>
              </li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous par email : [ton email de
              contact].
            </p>
          </div>
          <div>
            <h4> 8. Mineurs</h4>
            <p>
              Nos services sont destinés aux personnes majeures. Nous ne
              collectons pas sciemment de données relatives aux mineurs sans le
              consentement des parents ou tuteurs légaux.
            </p>
            <h4>9. Modifications</h4>
            <p>
              Nous pouvons mettre à jour cette Politique de Confidentialité à
              tout moment. La version en vigueur est celle publiée sur notre
              Site à la date de consultation.
            </p>
          </div>
          <div>
            <h4>10. Contact</h4>
            <p>
              Pour toute question relative à la gestion de vos données
              personnelles :
            </p>
            <div className="space-y-2">
              <p className="flex gap-2">
                <Mail color="#CECECE" /> Email : info@le-carino.com
              </p>
              <p className="flex gap-2">
                <Phone color="#CECECE" /> Téléphone : +237 696 54 10 55
              </p>
              <p className=" flex items-center gap-2">
                <Home color="#CECECE" />{" "}
                <span>Adresse : Playce Warda, Yaoundé, Cameroun</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
