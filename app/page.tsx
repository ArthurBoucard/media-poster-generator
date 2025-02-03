import Link from "next/link";
import { LP_GRID_ITEMS } from "lp-items"

export default function Web() {
  return (
    <div className="bg-emerald-950 min-h-screen">
      <section>
        <div className="mx-auto grid max-w-(--breakpoint-xl) px-4 py-8 text-center lg:py-16">
          <div className="mx-auto place-self-center">
            <h1 className="mb-4 max-w-2xl text-4xl leading-none font-extrabold tracking-tight md:text-5xl xl:text-6xl text-white">
              Media Poster Generator
            </h1>
          </div>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-8 sm:py-16 lg:px-6">
          <div className="justify-center space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
            {LP_GRID_ITEMS.map((singleItem) => (
              <Link href={`/app/${singleItem.link}/showcase`}>
                <div key={singleItem.title} className="flex flex-col items-center justify-center text-center rounded-lg transition duration-300 hover:bg-emerald-800 hover:shadow-lg hover:scale-105 p-4">
                  <div className="mb-4 flex size-30 items-center justify-center">
                    {singleItem.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">{singleItem.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
