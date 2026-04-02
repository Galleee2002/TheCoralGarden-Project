import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TheCoralGarden",
    short_name: "CoralGarden",
    description:
      "Equipos de purificación y tratamiento de agua para acuarismo, cultivo indoor, uso doméstico, comercial e industrial.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F8F8",
    theme_color: "#042F34",
    orientation: "portrait",
    icons: [
      {
        src: "/LOGO.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
