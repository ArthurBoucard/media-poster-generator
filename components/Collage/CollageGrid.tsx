"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

interface CollageItem {
  name: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
}

interface CollageGridProps {
  items: CollageItem[];
  setItems: (items: CollageItem[]) => void;
  columns: number;
  rows: number;
}

const CollageGrid: React.FC<CollageGridProps> = ({ items, setItems, columns, rows }) => {
  const [collageUrl, setCollageUrl] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateGridSize = () => {
      const viewportWidth = document.documentElement.clientWidth * 0.86;
      const viewportHeight = document.documentElement.clientHeight * 0.9;

      if (items[0]) {
        const { imageWidth, imageHeight } = items[0];
        const scaleFactor = Math.min(viewportWidth / (columns * imageWidth), viewportHeight / (rows * imageHeight));

        setGridSize({
          width: imageWidth * scaleFactor,
          height: imageHeight * scaleFactor,
        });
      }
    };

    updateGridSize();
    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, [items, columns, rows]);

  const moveItem = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;
      setItems((prevItems) => {
        const newItems = [...prevItems];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);
        return newItems;
      });
    },
    [setItems]
  );

  const generateCollage = async () => {
    const response = await fetch("/api/spotify/collage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items), // TODO: add nb of column or row, and ratio size (1:1, 4:3, 16:9)
    });

    if (!response.ok) {
      console.error("Failed to generate collage");
      return;
    }

    const blob = await response.blob();
    setCollageUrl(URL.createObjectURL(blob));
  };

  if (!items.length) return <p>No images available</p>;

  return (
    <div>
      <div
        className="grid h-[90vh]"
        style={{
          gridTemplateColumns: `repeat(${columns}, ${gridSize.width}px)`,
          gridTemplateRows: `repeat(${rows}, ${gridSize.height}px)`,
          maxWidth: "100%",
          maxHeight: "90vh",
        }}
      >
        {items.slice(0, columns * rows).map((item, index) => (
          <CollageItemComponent key={item.imageUrl} index={index} item={item} moveItem={moveItem} elementSize={gridSize} />
        ))}
      </div>
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
    </div>
  );
};

interface CollageItemComponentProps {
  item: CollageItem;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  elementSize: { width: number; height: number };
}

const CollageItemComponent: React.FC<CollageItemComponentProps> = ({ item, index, moveItem, elementSize }) => {
  const lastMovedIndex = useRef<number | null>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "item",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: "item",
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index && lastMovedIndex.current !== index) {
        moveItem(draggedItem.index, index);
        lastMovedIndex.current = index;
        draggedItem.index = index;
      }
    },
    drop: () => {
      lastMovedIndex.current = null;
    },
  }));

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`cursor-grab transition-opacity ${isDragging ? "opacity-50" : "opacity-100"}`}
      style={{ width: elementSize.width, height: elementSize.height }}
    >
      <Image
        src={item.imageUrl}
        alt={item.name}
        width={elementSize.width}
        height={elementSize.height}
        className="object-cover w-full h-full"
      />
    </div>
  );
};

export default CollageGrid;
