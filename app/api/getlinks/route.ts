'use server'
// /api/hello/routeModule.ts
import { ANIME } from "@consumet/extensions";
const getlink = async (id: string) => {
    const gogoanime = new ANIME.Gogoanime();
    // const links = await gogoanime.fetchEpisodeSources("one-piece-episode-1022");
    const links = await gogoanime.fetchEpisodeSources(id);
    return links;
};
  
export async function POST(req: Request) {
  const gogoanime = new ANIME.Gogoanime();
  const body = await req.json();
  const { id } = body;
  const link = await getlink(id); // Call the function with await

//   console.log(id);
  return new Response(JSON.stringify(link));
}