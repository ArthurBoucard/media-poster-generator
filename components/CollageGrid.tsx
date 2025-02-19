import Image from "next/image";
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

function getMaxElementSize(
    columns: number,
    rows: number,
    elementWidth: number,
    elementHeight: number
  ): { width: number; height: number }
{
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const scaleFactor = Math.min(viewportWidth / (columns * elementWidth), viewportHeight / (rows * elementHeight));

  return {
      width: elementWidth * scaleFactor,
      height: elementHeight * scaleFactor
  };
}
let globalColumnsWidth = 5;
let globalRowsHeight = 5;

const CollageGrid: React.FC<CollageGridProps> = ({ items, setItems, columns, rows }) => {
  if (items.length === 0) {
    return <p>No images available</p>;
  }
  items = items.slice(0, columns * rows);

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
  };
  console.log("globalColumnsWidth", globalColumnsWidth);
  console.log("globalRowsHeight", globalRowsHeight);

  return (
    <div className="grid h-[90vh] overflow-auto gap-0"
      style={{
        gridTemplateColumns: `repeat(${columns}, ${globalColumnsWidth}px))`, //TODO: fix this
        gridTemplateRows: `repeat(${rows}, ${globalRowsHeight}px))`,
      }}
    >
      {items.map((item, index) => (
        <CollageItemComponent
          key={item.imageUrl}
          index={index}
          item={item}
          moveItem={moveItem}
          columns={columns}
          rows={rows}
        />
      ))}
    </div>
  );
};

interface CollageItemComponentProps {
  item: CollageItem;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  columns: number;
  rows: number;
}

const CollageItemComponent: React.FC<CollageItemComponentProps> = ({
  item,
  index,
  moveItem,
  columns,
  rows,
}) => {
  const [, drag] = useDrag(() => ({
    type: "item",
    item: { index },
  }));

  const [, drop] = useDrop(() => ({
    accept: "item",
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  }));

  globalColumnsWidth = getMaxElementSize(columns, rows, item.imageWidth, item.imageHeight).width;
  globalRowsHeight = getMaxElementSize(columns, rows, item.imageWidth, item.imageHeight).height;

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="cursor-grab"
    >
      <Image
        src={item.imageUrl}
        alt={item.name}
        width={globalColumnsWidth}
        height={globalRowsHeight}
        // objectFit="contain"
        // className="object-cover"
      />
    </div>
  );
};

export default CollageGrid;
