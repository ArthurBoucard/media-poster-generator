import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

interface Album {
  name: string;
  imageUrl: string;
  totalTracks: number;
  totalWeight: number;
  score: number;
}

export async function POST(req: NextRequest) {
  try {
    const albums = await req.json()as Album[];

    if (!albums || albums.length === 0) {
      return NextResponse.json({ error: "No albums provided" }, { status: 400 });
    }

    // Limit to 25 albums (5x5 grid)
    const limitedAlbums = albums.slice(0, 25);

    // Unique image URLs to avoid multiple fetches
    const uniqueImages = [...new Set(limitedAlbums.map((album) => album.imageUrl))];
    const imageBufferMap = new Map<string, Buffer>();

    // Define collage size
    const gridSize = 5; // 5x5 grid
    const imgSize = 200; // Each image is 200x200 pixels
    const collageSize = imgSize * gridSize; // 1000x1000 pixels (1:1 ratio)

    // Fetch and resize images
    await Promise.all(
      uniqueImages.map(async (url) => {
        const response = await fetch(url);
        const buffer = Buffer.from(await response.arrayBuffer());

        // Crop to 1:1 ratio before resizing
        const resizedImage = await sharp(buffer)
          .resize(imgSize, imgSize, { fit: "cover" }) // Ensures all images are squares
          .toBuffer();

        imageBufferMap.set(url, resizedImage);
      })
    );

    // Create a blank 1000x1000px canvas for the collage
    const collage = await sharp({
      create: {
        width: collageSize,
        height: collageSize,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite(
        limitedAlbums.map((album, i) => ({
          input: imageBufferMap.get(album.imageUrl)!,
          top: Math.floor(i / gridSize) * imgSize,
          left: (i % gridSize) * imgSize,
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
