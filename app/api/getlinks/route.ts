// /api/getlinks/route.ts
import { ANIME } from "@consumet/extensions";

const getLinks = async (id: string) => {
    const gogoanime = new ANIME.Gogoanime();
    const links = await gogoanime.fetchEpisodeSources(id);
    return links;
};

export async function POST(req: Request) {
    const { id } = await req.json();

    if (!id) {
        return new Response("Invalid request: ID is missing", { status: 400 });
    }

    try {
        const links = await getLinks(id);
        return new Response(JSON.stringify(links), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error("Error fetching links:", error);
        return new Response("Internal server error", { status: 500 });
    }
}
