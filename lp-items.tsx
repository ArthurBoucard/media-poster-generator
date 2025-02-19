import Image from 'next/image';

export const LP_GRID_ITEMS = [
  {
    title: "Spotify",
    link: "spotify",
    icon: (
      <Image 
        src="/assets/spotify/logo.png" 
        alt="Logo" 
        className="object-contain"
        width={1000}
        height={1000}
      />
    ),
  },
  {
    title: "Letterboxd",
    link: "letterboxd",
    icon: (
      <Image 
        src="/assets/letterboxd/logo.png" 
        alt="Logo" 
        className="object-contain"
        width={1000}
        height={1000}
      />
    ),
  },
  {
    title: "Goodreads",
    link: "goodreads",
    icon: (
      <Image 
        src="/assets/goodreads/logo.png" 
        alt="Logo" 
        className="object-contain"
        width={1000}
        height={1000}
      />
    ),
  },
]
