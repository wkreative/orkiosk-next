import React from 'react'

export default function HeroKiosk() {
  return (
    <div className="relative flex justify-center md:justify-end items-center h-[500px] w-full max-w-[600px] mx-auto">
      {/* Glow Effect */}
      <div className="absolute inset-0 -z-10 rounded-[32px] bg-white/10 blur-3xl" />

      {/* Primary Kiosk (Front) */}
      <div className="relative z-20 animate-float">
        <img
          src="/images/21-inch-kiosk.png"
          alt="Kiosko de autoservicio Orkiosk Principal"
          className="w-[220px] sm:w-[260px] md:w-[300px] lg:w-[340px] h-auto object-contain drop-shadow-2xl select-none"
          draggable={false}
        />
      </div>

      {/* Secondary Kiosk (Back/Side) */}
      <div className="relative z-10 animate-float-reverse -ml-16 sm:-ml-24 mt-12">
        <img
          src="/images/kiosk-secondary.png"
          alt="Kiosko de autoservicio Orkiosk Secundario"
          className="w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px] h-auto object-contain drop-shadow-2xl select-none opacity-90"
          draggable={false}
        />
      </div>
    </div>
  )
}
