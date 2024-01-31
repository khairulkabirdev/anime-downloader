// /api/getlinks/route.ts
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    const { url  } = await req.json();
  

    if (!url ) {
        return new Response("Invalid request: url  is missing", { status: 400 });
    }

    try {
          // Path to the .env file
      const envFilePath = path.resolve(process.cwd(), '.env.local');

          // Read the existing content of the .env file
      let envContent = fs.readFileSync(envFilePath, 'utf8');

          // Update the NEXT_PUBLIC_BASE_URL value
      const updatedEnvContent = envContent.replace(
              /NEXT_PUBLIC_BASE_URL=.*/,
              `NEXT_PUBLIC_BASE_URL=${url}`
          );

          // Write the updated content back to the .env file
          fs.writeFileSync(envFilePath, updatedEnvContent);

          return new Response("url suctefully chage", { status: 200, headers: { 'Content-Type': 'application/json' } });
      } catch (error) {
          console.error('Error updating .env file:', error);
          return new Response("Internal server error", { status: 500 });
      }
}
