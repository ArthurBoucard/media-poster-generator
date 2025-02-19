'use client'

import Image from 'next/image';
import { useEffect, useState } from "react";
import { LP_GRID_ITEMS } from "lp-items"

  interface Album {
    name: string;
    imageUrl: string;
    totalTracks: number;
    totalWeight: number;
    score: number;
  }

export default function Spotify() {
  const item = LP_GRID_ITEMS.find(item => item.title === "Spotify") || { title: "Error", link: "error", icon: <div /> };
  const [topAlbums, setTopAlbums] = useState(Array<Album>());
  const [collageUrl, setCollageUrl] = useState<string | null>(null);

  const generateCollage = async () => {
    const response = await fetch("/api/spotify/collage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(topAlbums), // TODO: add nb of column or row, and ratio size (1:1, 4:3, 16:9)
    });

    if (!response.ok) {
      console.error("Failed to generate collage");
      return;
    }

    const blob = await response.blob();
    setCollageUrl(URL.createObjectURL(blob));
  };

  useEffect(() => {
    async function fetchTopAlbums() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await fetch(`${baseUrl}/api/spotify/top-albums`);
        if (!response.ok) {
          throw new Error("Failed to fetch top albums");
        }
        const data = await response.json() as Album[];
        setTopAlbums(data);
      } catch (error) {
        console.error("Error fetching top albums:", error);
      }
    }

    fetchTopAlbums();
  }, []);

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
        <div>
          {/* Carrousel of poster exemples */}
        </div>
        {/* <div className="mt-8">
          <h2 className="text-white text-lg">Top Albums</h2> {}
          <ul className="text-white">
            {topAlbums.map((album: Album, index: number) => (
              <li key={index}>
                {album.name}
                <Image 
                  src={album.imageUrl}
                  alt={album.name}
                  width={200}
                  height={200}
                  priority={false}
                />
              </li>
            ))}
          </ul>
        </div> */}
      </section>
      <section>
        {/* Poster edits elements */}
        <button onClick={generateCollage}>Generate Collage</button>
        {collageUrl && (
          <div>
            <Image
              src={collageUrl}
              alt="Generated Collage"
              width={1000}
              height={1000}
            />
            <a href={collageUrl} download="collage.png">
              <button>Download Collage</button>
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
  