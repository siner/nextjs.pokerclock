import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Reloj de poker",
    short_name: "Reloj de poker",
    description: "Un reloj de poker para tus partidas en casa",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512xx512",
        type: "image/png",
      },
    ],
  };
}
