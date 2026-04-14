import React from "react";

function MaintenancePage() {
  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-5">
      <img src="/Logo.png" alt="logo" className="h-20 w-auto mx-auto" />
      <h1 className="text-2xl font-bold text-center">Maintenance</h1>
      <p className="text-center">
        Nous effectuons des améliorations sur notre site pour mieux vous servir
        😊
        <br />
        En attendant, notre service client reste disponible pour prendre vos
        commandes au <a href="tel:+237696541055">+237 696 54 10 55</a>
      </p>
      <p className="text-center">Merci pour votre compréhension !</p>
    </div>
  );
}

export default MaintenancePage;
