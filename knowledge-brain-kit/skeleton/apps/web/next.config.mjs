import { withEve } from "eve/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // El DS es un paquete del workspace en TS/JSX → Next debe transpilarlo.
  transpilePackages: ["@brain/design-system-web"],
  // Imágenes remotas permitidas. Ejemplo: Vercel Blob público
  // (<store-id>.public.blob.vercel-storage.com). Ajusta al hosting del concepto.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

// withEve monta el agente (agent/) como servicio eve: en dev arranca su server
// y proxya /eve/v1/* mismo-origen; en Vercel genera el servicio. El agente lee
// la base de conocimiento del sitio (ver agent/instructions.md + agent/tools/).
export default withEve(nextConfig);
