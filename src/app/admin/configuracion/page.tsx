import { getSetting } from "@/features/admin/actions/settingActions";
import { HeroBannerForm } from "@/features/admin/components/HeroBannerForm";
import { SettingImageForm } from "@/features/admin/components/SettingImageForm";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";

export default async function ConfiguracionPage() {
  const [
    heroBannerUrl,
    aboutGallery1,
    aboutGallery2,
    aboutGallery3,
    serviceVenta,
    servicePostventa,
    serviceReparacion,
  ] = await Promise.all([
    getSetting("hero_banner_url"),
    getSetting("about_gallery_1"),
    getSetting("about_gallery_2"),
    getSetting("about_gallery_3"),
    getSetting("service_venta_image"),
    getSetting("service_postventa_image"),
    getSetting("service_reparacion_image"),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Configuración"
        description="Gestioná las imágenes y ajustes globales del sitio"
      />

      <div className="rounded-card border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary">
          <span className="inline-block h-5 w-0.5 rounded-full bg-text-secondary" />
          Banner principal (Hero)
        </h2>
        <HeroBannerForm currentUrl={heroBannerUrl} />
      </div>

      <div className="rounded-card border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-text-primary">
          <span className="inline-block h-5 w-0.5 rounded-full bg-text-secondary" />
          Sección &ldquo;Sobre nosotros&rdquo; — Galería
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Las 3 fotos verticales debajo del texto principal.
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="mb-2 text-sm font-medium">Foto izquierda</p>
            <SettingImageForm
              settingKey="about_gallery_1"
              currentUrl={aboutGallery1}
              label="foto izquierda"
              aspectClass="aspect-[3/4]"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Foto centro</p>
            <SettingImageForm
              settingKey="about_gallery_2"
              currentUrl={aboutGallery2}
              label="foto centro"
              aspectClass="aspect-[3/4]"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Foto derecha</p>
            <SettingImageForm
              settingKey="about_gallery_3"
              currentUrl={aboutGallery3}
              label="foto derecha"
              aspectClass="aspect-[3/4]"
            />
          </div>
        </div>
      </div>

      <div className="rounded-card border border-border/50 bg-card p-6 shadow-sm">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-text-primary">
          <span className="inline-block h-5 w-0.5 rounded-full bg-text-secondary" />
          Sección &ldquo;Nuestros servicios&rdquo; — Imágenes
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Una imagen por cada tarjeta de servicio.
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="mb-2 text-sm font-medium">Venta y asesoramiento</p>
            <SettingImageForm
              settingKey="service_venta_image"
              currentUrl={serviceVenta}
              label="imagen de venta"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Servicio post venta</p>
            <SettingImageForm
              settingKey="service_postventa_image"
              currentUrl={servicePostventa}
              label="imagen de post venta"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Reparación y mantenimiento</p>
            <SettingImageForm
              settingKey="service_reparacion_image"
              currentUrl={serviceReparacion}
              label="imagen de reparación"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
