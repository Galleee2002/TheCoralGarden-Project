import { getSetting } from "@/features/admin/actions/settingActions";
import { requireAdmin } from "@/lib/safe-action";
import { SettingImageCard } from "@/features/admin/components/settings/SettingImageCard";
import { SettingSlideCard } from "@/features/admin/components/settings/SettingSlideCard";
import { CorreoArgentinoSettingsCard } from "@/features/admin/components/settings/CorreoArgentinoSettingsCard";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HERO_SETTING_KEYS } from "@/lib/constants/hero-settings";
import { getCorreoArgentinoSettings } from "@/lib/correo-argentino/settings";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Configuración" };

export default async function ConfiguracionPage() {
  await requireAdmin();

  const [
    heroSlide1Image,
    heroBannerUrlLegacy,
    slide1Title,
    slide1Features,
    aboutGallery1,
    aboutGallery2,
    aboutGallery3,
    serviceVenta,
    servicePostventa,
    serviceReparacion,
    slide2Image,
    slide2Title,
    slide2Description,
    slide2Features,
    slide3Image,
    slide3Title,
    slide3Description,
    slide3Features,
    correoSettings,
  ] = await Promise.all([
    getSetting(HERO_SETTING_KEYS.slide1Image),
    getSetting(HERO_SETTING_KEYS.slide1ImageLegacy),
    getSetting(HERO_SETTING_KEYS.slide1Title),
    getSetting(HERO_SETTING_KEYS.slide1Features),
    getSetting("about_gallery_1"),
    getSetting("about_gallery_2"),
    getSetting("about_gallery_3"),
    getSetting("service_venta_image"),
    getSetting("service_postventa_image"),
    getSetting("service_reparacion_image"),
    getSetting(HERO_SETTING_KEYS.slide2Image),
    getSetting(HERO_SETTING_KEYS.slide2Title),
    getSetting(HERO_SETTING_KEYS.slide2Description),
    getSetting(HERO_SETTING_KEYS.slide2Features),
    getSetting(HERO_SETTING_KEYS.slide3Image),
    getSetting(HERO_SETTING_KEYS.slide3Title),
    getSetting(HERO_SETTING_KEYS.slide3Description),
    getSetting(HERO_SETTING_KEYS.slide3Features),
    getCorreoArgentinoSettings(),
  ]);

  const slide1Image = heroSlide1Image || heroBannerUrlLegacy;
  const appearanceSlides = [
    {
      index: 1,
      title: "Slide 1",
      image: slide1Image,
      currentTitle: slide1Title,
      currentDescription: null,
      currentFeatures: slide1Features,
    },
    {
      index: 2,
      title: "Slide 2",
      image: slide2Image,
      currentTitle: slide2Title,
      currentDescription: slide2Description,
      currentFeatures: slide2Features,
    },
    {
      index: 3,
      title: "Slide 3",
      image: slide3Image,
      currentTitle: slide3Title,
      currentDescription: slide3Description,
      currentFeatures: slide3Features,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Configuración"
        description="Gestioná las imágenes y ajustes globales del sitio"
      />

      <Tabs defaultValue="apariencia" className="gap-6">
        <div className="mb-6">
          <TabsList className="rounded-card border-border/40 bg-card-light grid h-auto w-full auto-rows-fr grid-cols-1 gap-2 border p-2 sm:grid-cols-2 xl:grid-cols-4">
            <TabsTrigger
              value="apariencia"
              className="text-text-primary/70 data-[state=active]:border-border/40 data-[state=active]:bg-background data-[state=active]:text-text-primary h-full w-full rounded-[12px] px-4 py-3 text-center text-sm leading-tight whitespace-normal data-[state=active]:shadow-none sm:text-base"
            >
              Apariencia
            </TabsTrigger>
            <TabsTrigger
              value="nosotros"
              className="text-text-primary/70 data-[state=active]:border-border/40 data-[state=active]:bg-background data-[state=active]:text-text-primary h-full w-full rounded-[12px] px-4 py-3 text-center text-sm leading-tight whitespace-normal data-[state=active]:shadow-none sm:text-base"
            >
              Nosotros
            </TabsTrigger>
            <TabsTrigger
              value="servicios"
              className="text-text-primary/70 data-[state=active]:border-border/40 data-[state=active]:bg-background data-[state=active]:text-text-primary h-full w-full rounded-[12px] px-4 py-3 text-center text-sm leading-tight whitespace-normal data-[state=active]:shadow-none sm:text-base"
            >
              Servicios
            </TabsTrigger>
            <TabsTrigger
              value="correo"
              className="text-text-primary/70 data-[state=active]:border-border/40 data-[state=active]:bg-background data-[state=active]:text-text-primary h-full w-full rounded-[12px] px-4 py-3 text-center text-sm leading-tight whitespace-normal data-[state=active]:shadow-none sm:text-base"
            >
              Correo Argentino
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="apariencia" className="space-y-6">
          <div className="space-y-4">
            {appearanceSlides.map((slide) => (
              <div
                key={slide.index}
                className="rounded-card border-border/50 bg-card border p-6 shadow-sm"
              >
                <div className="border-border/50 mb-5 border-b pb-4">
                  <h3 className="text-text-primary text-lg font-semibold">
                    {slide.title}
                  </h3>
                </div>
                <SettingSlideCard
                  slideIndex={slide.index}
                  currentImage={slide.image}
                  currentTitle={slide.currentTitle}
                  currentDescription={slide.currentDescription}
                  currentFeatures={slide.currentFeatures}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nosotros">
          <div className="rounded-card border-border/50 bg-card border p-6 shadow-sm">
            <h2 className="text-text-primary mb-1 flex items-center gap-2 text-lg font-semibold">
              <span className="bg-text-secondary inline-block h-5 w-0.5 rounded-full" />
              Galería &ldquo;Sobre nosotros&rdquo;
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Las 3 fotos verticales debajo del texto principal.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="mb-2 text-sm font-medium">Foto izquierda</p>
                <SettingImageCard
                  settingKey="about_gallery_1"
                  currentUrl={aboutGallery1}
                  label="foto izquierda"
                  aspectClass="aspect-[3/4]"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Foto centro</p>
                <SettingImageCard
                  settingKey="about_gallery_2"
                  currentUrl={aboutGallery2}
                  label="foto centro"
                  aspectClass="aspect-[3/4]"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Foto derecha</p>
                <SettingImageCard
                  settingKey="about_gallery_3"
                  currentUrl={aboutGallery3}
                  label="foto derecha"
                  aspectClass="aspect-[3/4]"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="servicios">
          <div className="rounded-card border-border/50 bg-card border p-6 shadow-sm">
            <h2 className="text-text-primary mb-1 flex items-center gap-2 text-lg font-semibold">
              <span className="bg-text-secondary inline-block h-5 w-0.5 rounded-full" />
              Imágenes de servicios
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Una imagen por cada tarjeta de servicio.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="mb-2 text-sm font-medium">
                  Venta y asesoramiento
                </p>
                <SettingImageCard
                  settingKey="service_venta_image"
                  currentUrl={serviceVenta}
                  label="imagen de venta"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Servicio post venta</p>
                <SettingImageCard
                  settingKey="service_postventa_image"
                  currentUrl={servicePostventa}
                  label="imagen de post venta"
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">
                  Reparación y mantenimiento
                </p>
                <SettingImageCard
                  settingKey="service_reparacion_image"
                  currentUrl={serviceReparacion}
                  label="imagen de reparación"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="correo">
          <div className="rounded-card border-border/50 bg-card border p-6 shadow-sm">
            <h2 className="text-text-primary mb-1 flex items-center gap-2 text-lg font-semibold">
              <span className="bg-text-secondary inline-block h-5 w-0.5 rounded-full" />
              Operación de Correo Argentino
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
              Configurá credenciales, remitente, origen, defaults de envío y
              sincronizá el customerId de MiCorreo.
            </p>
            <CorreoArgentinoSettingsCard
              customerId={correoSettings.customerId}
              apiPasswordConfigured={correoSettings.apiPasswordConfigured}
              miCorreoPasswordConfigured={
                correoSettings.miCorreoPasswordConfigured
              }
              defaultValues={{
                baseUrl: correoSettings.baseUrl,
                apiUser: correoSettings.apiUser,
                apiPassword: "",
                miCorreoEmail: correoSettings.miCorreoEmail,
                miCorreoPassword: "",
                defaultDeliveryType: correoSettings.defaultDeliveryType,
                defaultProductType: correoSettings.defaultProductType,
                defaultAgency: correoSettings.defaultAgency,
                defaultWeight: correoSettings.defaultWeight,
                defaultHeight: correoSettings.defaultHeight,
                defaultLength: correoSettings.defaultLength,
                defaultWidth: correoSettings.defaultWidth,
                defaultProvinceCode: correoSettings.defaultProvinceCode,
                senderName: correoSettings.senderName,
                senderEmail: correoSettings.senderEmail,
                senderPhone: correoSettings.senderPhone,
                senderCellphone: correoSettings.senderCellphone,
                originStreet: correoSettings.originStreet,
                originStreetNumber: correoSettings.originStreetNumber,
                originFloor: correoSettings.originFloor ?? "",
                originApartment: correoSettings.originApartment ?? "",
                originCity: correoSettings.originCity,
                originProvinceCode: correoSettings.originProvinceCode,
                originPostalCode: correoSettings.originPostalCode,
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
