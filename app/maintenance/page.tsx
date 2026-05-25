import React from "react";
import { Wrench, Phone, Mail, Clock } from "lucide-react";

function MaintenancePage() {
  return (
    <div className="relative w-full max-w-2xl px-6 py-12 mx-auto text-center flex flex-col gap-8 items-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl">
      {/* Decorative background lights */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="relative group">
        <img
          src="/Logo.png"
          alt="Carino logo"
          className="h-28 w-auto mx-auto object-contain drop-shadow-[0_4px_12px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Animated Wrench Icon */}
      <div className="flex flex-col gap-2 items-center">
        <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 animate-pulse mb-2">
          <Wrench className="h-8 w-8 animate-spin" style={{ animationDuration: "10s" }} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-serif">
          Site en Maintenance
        </h1>
        <div className="w-12 h-1 bg-amber-500 rounded-full mt-2" />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-4 max-w-lg">
        <p className="text-base text-gray-200 leading-relaxed font-sans">
          Nous effectuons actuellement des améliorations sur notre site pour vous offrir une expérience encore plus agréable et fluide 😊
        </p>
        <p className="text-sm text-gray-400 font-sans">
          Merci pour votre patience et votre précieuse compréhension !
        </p>
      </div>

      {/* Contact Section */}
      <div className="w-full flex flex-col gap-4 mt-4">
        <p className="text-xs uppercase tracking-wider text-amber-500 font-semibold font-general">
          Besoin de commander ? Notre service reste actif :
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Phone Card */}
          <a
            href="tel:+237696541055"
            className="flex items-center gap-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all p-4 rounded-xl text-left group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <Phone className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-gray-450 font-bold uppercase tracking-wider">Téléphone</p>
              <p className="text-sm font-bold text-white group-hover:text-amber-450 transition-colors truncate">
                +237 696 54 10 55
              </p>
            </div>
          </a>

          {/* Email Card */}
          <a
            href="mailto:info@le-carino.com"
            className="flex items-center gap-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all p-4 rounded-xl text-left group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <Mail className="h-5 w-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-gray-450 font-bold uppercase tracking-wider">Email Support</p>
              <p className="text-sm font-bold text-white group-hover:text-amber-450 transition-colors truncate">
                info@le-carino.com
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default MaintenancePage;
