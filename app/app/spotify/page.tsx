'use client'

import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Carousel from "components/Carousel";
import CollageGrid from "components/Collage/CollageGrid";
import CollageSettings from "components/Collage/inputs";
import { LP_GRID_ITEMS } from "lp-items"

interface Album {
  name: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  totalTracks: number;
  totalWeight: number;
  score: number;
}

interface CollageItem {
  name: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
}

const mapToCollageItem = (album: Album): CollageItem => { // TODO: update with other type: tracks, artists
  return {
    name: album.name,
    imageUrl: album.imageUrl,
    imageWidth: album.imageWidth,
    imageHeight: album.imageHeight,
  };
};

export default function Spotify() {
  const item = LP_GRID_ITEMS.find(item => item.title === "Spotify") || { title: "Error", link: "error", icon: <div /> };
  const [topAlbums, setTopAlbums] = useState(Array<Album>());
  const [collageItems, setCollageItems] = useState<CollageItem[]>([]);
  const [columns, setColumns] = useState<number>(5);
  const [rows, setRows] = useState<number>(5);

  const updateCollageItems = () => {
    const mappedItems = topAlbums.map(mapToCollageItem);
    setCollageItems(mappedItems);
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

  useEffect(() => {
    if (topAlbums.length > 0) {
      updateCollageItems();
    }
  }, [topAlbums])

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
        <div className=" mx-auto">
          <Carousel images={[
            "/assets/spotify/carousel/1.png",
            "/assets/spotify/carousel/2.png",
            "/assets/spotify/carousel/3.png",
          ]} />
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
      <div className="w-[90%] h-[90%] mx-auto">
        <DndProvider backend={HTML5Backend}>
          <section className=" bg-emerald-300 p-4 rounded-lg">
            <CollageSettings columns={columns} rows={rows} setColumns={setColumns} setRows={setRows} />
            <div>
              <CollageGrid items={collageItems}
                setItems={setCollageItems}
                columns={columns}
                rows={rows}
              />
            </div>
          </section>
        </DndProvider>
      </div>
    </div>
  );
}
  