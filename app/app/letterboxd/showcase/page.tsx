'use client'

import { LP_GRID_ITEMS } from "lp-items"

export default function LetterboxdShowcase() {
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
              <button className="mb-2 text-xl font-bold text-white bg-emerald-800 rounded-lg p-4 transition duration-300 hover:bg-emerald-700 hover:shadow-lg hover:scale-105"
                onClick={() => {
                  window.location.href = "/api/" + item.link + "/login";
                }}
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
  