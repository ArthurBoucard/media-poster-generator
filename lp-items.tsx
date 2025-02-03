import Image from 'next/image';

export const LP_GRID_ITEMS = [
  {
    title: "Spotify",
    icon: (
      <Image 
        src="/assets/spotify.png" 
        alt="Logo" 
        className="object-contain"
        width={1000}
        height={1000}
      />
    ),
  },
  {
    title: "Letterboxd",
    icon: (
      <Image 
        src="/assets/letterboxd.png" 
        alt="Logo" 
        className="object-contain"
        width={1000}
        height={1000}
      />
    ),
  },
  {
    title: "Goodreads",
    icon: (
      <Image 
        src="/assets/goodreads.png" 
        alt="Logo" 
        className="object-contain"
        width={1000}
        height={1000}
      />
    ),
  },
]
