'use client'

import { LP_GRID_ITEMS } from "lp-items"

export default function Letterboxd() {
  const item = LP_GRID_ITEMS.find(item => item.title === "Letterboxd") || { title: "Error", link: "error", icon: <div /> };

  return (
    <div className="bg-emerald-950 min-h-screen">
      <section>
        <div className="mx-auto grid max-w-(--breakpoint-xl) px-4 py-8 text-center lg:py-16">
          <div className="mx-auto place-self-center">
            <div key={item.title} className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 flex size-40 items-center justify-center">
                {item.icon}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
  