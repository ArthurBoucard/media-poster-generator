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
  const viewportHeight = window.innerHeight - (window.innerHeight * 0.1);

  const scaleFactor = Math.min(viewportWidth / (columns * elementWidth), viewportHeight / (rows * elementHeight));

  return {
      width: elementWidth * scaleFactor,
      height: elementHeight * scaleFactor
  };
}

const CollageGrid: React.FC<CollageGridProps> = ({ items, setItems, columns, rows }) => {
  if (items.length === 0) {
    return <p>No images available</p>;
  }
  items = items.slice(0, columns * rows);

  const elementSize =
    items.length > 0 && items[0]
      ? getMaxElementSize(columns, rows, items[0].imageWidth, items[0].imageHeight)
      : { width: 50, height: 50 };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setItems(newItems);
  };

  return (
    <div className="grid h-[90vh] overflow-auto gap-0"
      style={{
        gridTemplateColumns: `repeat(${columns}, ${elementSize.width}px)`,
        gridTemplateRows: `repeat(${rows}, ${elementSize.height}px)`,
        width: `${Math.min(elementSize.width * columns, window.innerWidth)}px`,
        height: `${Math.min(elementSize.height * rows, window.innerHeight - (window.innerHeight * 0.1))}px`,
      }}
    >
      {items.map((item, index) => (
        <CollageItemComponent
          key={item.imageUrl}
          index={index}
          item={item}
          moveItem={moveItem}
          elementSize={elementSize}
        />
      ))}
    </div>
  );
};

interface CollageItemComponentProps {
  item: CollageItem;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  elementSize: { width: number; height: number };
}

const CollageItemComponent: React.FC<CollageItemComponentProps> = ({
  item,
  index,
  moveItem,
  elementSize,
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

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="cursor-grab"
    >
      <Image
        src={item.imageUrl}
        alt={item.name}
        width={elementSize.width}
        height={elementSize.height}
        // objectFit="contain"
        // className="object-cover"
      />
    </div>
  );
};

export default CollageGrid;
