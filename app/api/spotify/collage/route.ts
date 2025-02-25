import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

interface Album {
  name: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
}

interface CollageRequest {
  items: Album[];
  columns: number;
  rows: number;
}

export async function POST(req: NextRequest) {
  try {
    const { items: albums, columns, rows } = (await req.json()) as CollageRequest;

    if (!albums || albums.length === 0) {
      return NextResponse.json({ error: "No albums provided" }, { status: 400 });
    }

    const limitedAlbums = albums.slice(0, columns * rows);

    const uniqueImages = Array.from(new Set(limitedAlbums.map((album) => album.imageUrl)));
    const imageBufferMap = new Map<string, Buffer>();

    const imgSize = 500;
    const collageWidth = columns * imgSize;
    const collageHeight = rows * imgSize;

    await Promise.all(
      uniqueImages.map(async (url) => {
        const response = await fetch(url);
        const buffer = Buffer.from(await response.arrayBuffer());

        const resizedImage = await sharp(buffer)
          .resize(imgSize, imgSize, { fit: "cover" })
          .toBuffer();

        imageBufferMap.set(url, resizedImage);
      })
    );

    const collage = await sharp({
      create: {
        width: collageWidth,
        height: collageHeight,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite(
        limitedAlbums.map((album, i) => ({
          input: imageBufferMap.get(album.imageUrl)!,
          top: Math.floor(i / columns) * imgSize,
          left: (i % columns) * imgSize,
        }))
      )
      .png()
      .toBuffer();

    return new NextResponse(collage, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Image processing failed" }, { status: 500 });
  }
}
