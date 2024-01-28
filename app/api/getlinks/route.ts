// /api/getlinks/route.ts
import { ANIME, ISource, StreamingServers } from "@consumet/extensions";

const getLinks = async (id: string, server: string) => {
  const gogoanime = new ANIME.Gogoanime();
  let links;

  switch (server) {
      case "gogocdn":
          links = await gogoanime.fetchEpisodeSources(id, StreamingServers.GogoCDN);
          break;
      case "streamsb":
          links = await gogoanime.fetchEpisodeSources(id, StreamingServers.StreamSB);
          break;
      case "vidstreaming":
          links = await gogoanime.fetchEpisodeSources(id, StreamingServers.VidStreaming);
          break;
      default:
          links = await gogoanime.fetchEpisodeSources(id, StreamingServers.GogoCDN);
          break;
  }

  return links;
};


export async function POST(req: Request) {
    const { id , server} = await req.json();
  

    if (!id) {
        return new Response("Invalid request: ID is missing", { status: 400 });
    }

    try {
        const links = await getLinks(id,server);
        return new Response(JSON.stringify(links), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error("Error fetching links:", error);
        return new Response("Internal server error", { status: 500 });
    }
}
