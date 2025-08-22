import Homebutton from "@/components/Privacy/homebutton";
import PrivacyHero from "@/components/Privacy/PrivacyHero";
import { Mail, Phone } from "lucide-react";
import React from "react";

const Page = () => {
  return (
    <>
      <PrivacyHero />
      <Homebutton />

      <div className="container mx-auto flex flex-col gap-4 p-7 lg:p-0">
        <h3 className="text-center">Politique & confidentialité</h3>
        <div className="text-left flex flex-col gap-3 ">
          <div>
            <h4>1. Données collectées</h4>
            <p>
              Nous collectons uniquement les données nécessaires à la fourniture
              de nos services :
            </p>
            <ul className=" list-disc ml-4  ">
              <li>
                Données d’identification : nom, prénom, adresse email, numéro de
                téléphone, adresse de livraison.
              </li>
              <li>
                Données de commande : historique des commandes, préférences
                alimentaires.
              </li>
              <li>
                Données de paiement : traitées par nos prestataires sécurisés
                (nous ne stockons pas vos informations bancaires).
              </li>
              <li>
                Données techniques : adresse IP, type de navigateur,
                statistiques de navigation (cookies).
              </li>
            </ul>
          </div>
          <div>
            <h4>2. Finalités de la collecte</h4>
            <p>Vos données personnelles sont utilisées uniquement pour :</p>
            <ul className=" list-disc ml-4">
              <li>gérer vos commandes et réservations,</li>
              <li>assurer la livraison de vos repas,</li>
              <li>
                vous contacter en cas de problème ou d’information relative à
                votre commande,
              </li>
              <li>améliorer nos services et notre site internet,</li>
              <li>
                vous informer sur nos offres, promotions ou événements (si vous
                y avez consenti).
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
                nos partenaires de paiement en ligne (prestataires sécurisés),
              </li>
              <li>nos services de livraison,</li>
              <li>
                nos prestataires techniques (hébergeur, outils de gestion du
                site).
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
              <li>améliorer votre expérience de navigation,</li>
              <li>mémoriser vos préférences (panier, langue, etc.)</li>
              <li>
                analyser la fréquentation du site (Google Analytics ou
                équivalent).
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
                Les données liées à vos commandes sont conservées pendant la
                durée légale nécessaire à des fins comptables et fiscales.
              </li>
              <li>
                Les données marketing (inscription à la newsletter) sont
                conservées jusqu’à votre désinscription
              </li>
              <li>
                Les cookies peuvent être conservés jusqu’à 13 mois maximum.
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
              <li>tout accès non autorisé,</li>
              <li>toute modification, divulgation ou destruction.</li>
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
              <li>droit d’accès à vos données,</li>
              <li>droit de rectification,</li>
              <li>droit de suppression,</li>
              <li>droit d’opposition à leur traitement,</li>
              <li>droit de portabilité (dans certains cas).</li>
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
            <p className="flex gap-2">
              <Mail color="#CECECE" /> Email : info@le-carino.com
            </p>
            <p className="flex gap-2">
              <Phone color="#2B2A2A" /> Téléphone : +237 696 54 10 55
            </p>
            <p>🏠 Adresse : Playce Warda, Yaoundé, Cameroun</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
