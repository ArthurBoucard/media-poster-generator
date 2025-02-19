import { getCookie } from 'cookies-next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const accessToken = await getCookie('spotify_access_token', { req });

  interface TracksData {
    items: {
      album: {
        id: string;
        name: string;
        images: { url: string }[];
      };
    }[];
  }
  interface AlbumData {
    name: string;
    imageUrl: string;
    imageWidth: number;
    imageHeight: number;
    totalTracks: number;
    totalWeight: number;
  }

  if (!accessToken) {
    return NextResponse.json({ error: "Access token not found" }, { status: 401 });
  }

  const totalTracks = parseInt(req.nextUrl.searchParams.get('totalTracks') || '50', 10);
  const timerange = req.nextUrl.searchParams.get('timerange') || 'short_term';
  let TotalTracksData = [] as TracksData['items'];
  let offset = 0;
  let fetchedTracksCount = 50;
  
  while (fetchedTracksCount === 50) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/top/tracks?limit=50&offset=${offset}&time_range=${timerange}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.statusText}`);
      }
  
      const data = await response.json() as TracksData;
      fetchedTracksCount = data.items.length;
      TotalTracksData = TotalTracksData.concat(data.items);
      offset += 50;
      if (offset >= totalTracks + 50) { // TODO: maybe remove, if a lot of tracks from same album doesnt return total desired value of albums (incovenience without limitation longer loading time for requests)
        break;
      }
    } catch (error) {
      console.error("Error fetching top albums:", error);
      return NextResponse.json({ error: "Failed to fetch top albums" }, { status: 500 });
    }
  }

  const albumData = TotalTracksData.reduce((acc, track, index) => {
    const albumId = track.album.id;
    const trackPosition = index + 1;

    if (!acc[albumId]) {
      acc[albumId] = {
        name: track.album.name,
        imageUrl: track.album?.images?.[0]?.url || '',
        imageWidth: 640,
        imageHeight: 640,
        totalTracks: 0,
        totalWeight: 0
      };
    }

    acc[albumId].totalTracks += 1;

    const trackWeight = Math.pow(trackPosition, 1.5); // Exponential weight factor
    acc[albumId].totalWeight += trackWeight;

    return acc;
  }, {} as Record<string, AlbumData>);

  const processedAlbumData = Object.keys(albumData).map(albumId => {
    const album = albumData[albumId] as AlbumData;
  
    return {
      albumId,
      name: album.name,
      imageUrl: album.imageUrl,
      imageWidth: album.imageWidth,
      imageHeight: album.imageHeight,
      totalTracks: album.totalTracks,
      totalWeight: album.totalWeight,
    };
  });

  const scoredAlbumData = processedAlbumData.map(album => {
    const score = (album.totalWeight / album.totalTracks);
    return { ...album, score };
  });

  const sortedAlbumData = scoredAlbumData.sort((a, b) => a.score - b.score);

  return NextResponse.json(sortedAlbumData, { status: 200 });
}
