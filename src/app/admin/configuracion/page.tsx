import { getSetting } from "@/features/admin/actions/settingActions";
import { requireAdmin } from "@/lib/safe-action";
import { SettingImageCard } from "@/features/admin/components/settings/SettingImageCard";
import { SettingSlideCard } from "@/features/admin/components/settings/SettingSlideCard";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Configuración" };

export default async function ConfiguracionPage() {
  await requireAdmin();

  const [
    heroBannerUrl,
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
  ] = await Promise.all([
    getSetting("hero_banner_url"),
    getSetting("hero_slide1_title"),
    getSetting("hero_slide1_features"),
    getSetting("about_gallery_1"),
    getSetting("about_gallery_2"),
    getSetting("about_gallery_3"),
    getSetting("service_venta_image"),
    getSetting("service_postventa_image"),
    getSetting("service_reparacion_image"),
    getSetting("hero_slide2_image"),
    getSetting("hero_slide2_title"),
    getSetting("hero_slide2_description"),
    getSetting("hero_slide2_features"),
    getSetting("hero_slide3_image"),
    getSetting("hero_slide3_title"),
    getSetting("hero_slide3_description"),
    getSetting("hero_slide3_features"),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Configuración"
        description="Gestioná las imágenes y ajustes globales del sitio"
      />

      <Tabs defaultValue="apariencia">
        <TabsList className="mb-6">
          <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
          <TabsTrigger value="nosotros">Nosotros</TabsTrigger>
          <TabsTrigger value="servicios">Servicios</TabsTrigger>
        </TabsList>

        <TabsContent value="apariencia" className="space-y-6">
          {/* Slide 1 */}
          <div className="rounded-card border border-border/50 bg-card p-6 shadow-sm">
            <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-text-primary">
              <span className="inline-block h-5 w-0.5 rounded-full bg-text-secondary" />
              Hero — Slide 1
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Imagen, título y características del primer slide del hero.
            </p>
            <SettingSlideCard
              slideIndex={1}
              currentImage={heroBannerUrl}
              currentTitle={slide1Title}
              currentDescription={null}
              currentFeatures={slide1Features}
            />
          </div>

          {/* Slide 2 */}
          <div className="rounded-card border border-border/50 bg-card p-6 shadow-sm">
            <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-text-primary">
              <span className="inline-block h-5 w-0.5 rounded-full bg-text-secondary" />
              Hero — Slide 2
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Imagen, título y contenido del segundo slide del hero.
            </p>
            <SettingSlideCard
              slideIndex={2}
              currentImage={slide2Image}
              currentTitle={slide2Title}
              currentDescription={slide2Description}
              currentFeatures={slide2Features}
            />
          </div>

          {/* Slide 3 */}
          <div className="rounded-card border border-border/50 bg-card p-6 shadow-sm">
            <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-text-primary">
              <span className="inline-block h-5 w-0.5 rounded-full bg-text-secondary" />
              Hero — Slide 3
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Imagen, título y contenido del tercer slide del hero.
            </p>
            <SettingSlideCard
              slideIndex={3}
              currentImage={slide3Image}
              currentTitle={slide3Title}
              currentDescription={slide3Description}
              currentFeatures={slide3Features}
            />
          </div>
        </TabsContent>

        <TabsContent value="nosotros">
          <div className="rounded-card border border-border/50 bg-card p-6 shadow-sm">
            <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-text-primary">
              <span className="inline-block h-5 w-0.5 rounded-full bg-text-secondary" />
              Galería &ldquo;Sobre nosotros&rdquo;
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
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
          <div className="rounded-card border border-border/50 bg-card p-6 shadow-sm">
            <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-text-primary">
              <span className="inline-block h-5 w-0.5 rounded-full bg-text-secondary" />
              Imágenes de servicios
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Una imagen por cada tarjeta de servicio.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="mb-2 text-sm font-medium">Venta y asesoramiento</p>
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
                <p className="mb-2 text-sm font-medium">Reparación y mantenimiento</p>
                <SettingImageCard
                  settingKey="service_reparacion_image"
                  currentUrl={serviceReparacion}
                  label="imagen de reparación"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
