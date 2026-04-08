import { unstable_noStore as noStore } from "next/cache";
import { getSetting } from "@/features/admin/actions/settingActions";
import { HERO_SETTING_KEYS } from "@/lib/constants/hero-settings";
import { HeroSlider } from "./HeroSlider";

const DEFAULT_SLIDE1_TITLE = "Purificadores de agua";
const DEFAULT_SLIDE1_FEATURES = [
  "Agua para tu cultivo indoor",
  "Hidroponia",
  "Aquarismo",
];

export async function HeroSection() {
  noStore();
  const [
    heroSlide1Image,
    heroBannerUrlLegacy,
    slide1Title,
    slide1Features,
    slide2Image,
    slide2Title,
    slide2Description,
    slide2Features,
    slide3Image,
    slide3Title,
    slide3Description,
    slide3Features,
  ] = await Promise.all([
    getSetting(HERO_SETTING_KEYS.slide1Image),
    getSetting(HERO_SETTING_KEYS.slide1ImageLegacy),
    getSetting(HERO_SETTING_KEYS.slide1Title),
    getSetting(HERO_SETTING_KEYS.slide1Features),
    getSetting(HERO_SETTING_KEYS.slide2Image),
    getSetting(HERO_SETTING_KEYS.slide2Title),
    getSetting(HERO_SETTING_KEYS.slide2Description),
    getSetting(HERO_SETTING_KEYS.slide2Features),
    getSetting(HERO_SETTING_KEYS.slide3Image),
    getSetting(HERO_SETTING_KEYS.slide3Title),
    getSetting(HERO_SETTING_KEYS.slide3Description),
    getSetting(HERO_SETTING_KEYS.slide3Features),
  ]);

  const slide1Image = heroSlide1Image || heroBannerUrlLegacy;

  const parseFeatures = (raw: string | null) =>
    raw && raw.trim().length > 0
      ? raw.split("\n").map((f) => f.trim()).filter(Boolean)
      : null;

  const parsedSlide1Features = parseFeatures(slide1Features) ?? DEFAULT_SLIDE1_FEATURES;
  const parsedSlide2Features = parseFeatures(slide2Features);
  const parsedSlide3Features = parseFeatures(slide3Features);

  const slides = [
    {
      image: slide1Image,
      title: slide1Title ?? DEFAULT_SLIDE1_TITLE,
      features: parsedSlide1Features,
    },
    {
      image: slide2Image,
      title: slide2Title ?? "Slide 2",
      ...(parsedSlide2Features
        ? { features: parsedSlide2Features }
        : { description: slide2Description || undefined }),
    },
    {
      image: slide3Image,
      title: slide3Title ?? "Slide 3",
      ...(parsedSlide3Features
        ? { features: parsedSlide3Features }
        : { description: slide3Description || undefined }),
    },
  ];

  return <HeroSlider slides={slides} />;
}
