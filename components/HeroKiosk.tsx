import React from 'react'

export default function HeroKiosk() {
  return (
    <div className="relative flex justify-center md:justify-end">
      <div className="absolute inset-0 -z-10 rounded-[32px] bg-white/10 blur-3xl" />
      <img
        src="/images/21-inch-kiosk.png"
        alt="Kiosko de autoservicio Orkiosk"
        className="w-[260px] sm:w-[320px] md:w-[380px] lg:w-[420px] h-auto object-contain drop-shadow-2xl select-none"
        draggable={false}
      />
    </div>
  )
}
