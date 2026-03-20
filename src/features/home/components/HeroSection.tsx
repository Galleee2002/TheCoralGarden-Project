import { getSetting } from "@/features/admin/actions/settingActions";
import { HeroSlider } from "./HeroSlider";

const slide1Features = [
  "Agua pura para tu hogar, comercio o industria",
  "Servicio técnico especializado 24/7",
  "Envíos a todo el país",
];

export async function HeroSection() {
  const [
    heroBannerUrl,
    slide2Image,
    slide2Title,
    slide2Description,
    slide3Image,
    slide3Title,
    slide3Description,
  ] = await Promise.all([
    getSetting("hero_banner_url"),
    getSetting("hero_slide2_image"),
    getSetting("hero_slide2_title"),
    getSetting("hero_slide2_description"),
    getSetting("hero_slide3_image"),
    getSetting("hero_slide3_title"),
    getSetting("hero_slide3_description"),
  ]);

  const slides = [
    {
      image: heroBannerUrl,
      title: "Purificadores de agua",
      features: slide1Features,
    },
    {
      image: slide2Image,
      title: slide2Title ?? "Slide 2",
      description: slide2Description ?? undefined,
    },
    {
      image: slide3Image,
      title: slide3Title ?? "Slide 3",
      description: slide3Description ?? undefined,
    },
  ];

  return <HeroSlider slides={slides} />;
}
