"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createProduct, updateProduct } from "@/features/admin/actions/productActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ProductTabBasic } from "./ProductTabBasic";
import { ProductTabPricing } from "./ProductTabPricing";
import { ProductTabMedia } from "./ProductTabMedia";
import { ProductTabSpecs } from "./ProductTabSpecs";

const formSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  description: z.string().min(10, "Mínimo 10 caracteres"),
  price: z.number().positive("Debe ser mayor a 0"),
  stock: z.number().int().min(0, "No puede ser negativo"),
  images: z.array(z.string().url()).min(1, "Agregá al menos una imagen principal"),
  specifications: z
    .array(z.string().min(1, "La especificación no puede estar vacía"))
    .min(1, "Agregá al menos una especificación"),
  categoryId: z.string().min(1, "Seleccioná una categoría"),
  featured: z.boolean(),
  active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormTabsProps {
  categories: CategoryOption[];
  mode: "create" | "edit";
  defaultValues?: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
    price?: number;
    stock?: number;
    images?: string[];
    specifications?: string[];
    categoryId?: string;
    featured?: boolean;
    active?: boolean;
  };
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ProductFormTabs({ categories, mode, defaultValues }: ProductFormTabsProps) {
  const router = useRouter();
  const [categoryList, setCategoryList] = useState<CategoryOption[]>(categories);
  const [activeTab, setActiveTab] = useState("basico");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      slug: defaultValues?.slug ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? 0,
      stock: defaultValues?.stock ?? 0,
      images: defaultValues?.images ?? [],
      specifications: defaultValues?.specifications ?? [],
      categoryId: defaultValues?.categoryId ?? "",
      featured: defaultValues?.featured ?? false,
      active: defaultValues?.active ?? true,
    },
  });

  const handleNameChange = (name: string) => {
    if (mode === "create") {
      form.setValue("slug", toSlug(name), { shouldValidate: false });
    }
  };

  const handleCategoryCreated = (cat: { id: string; name: string; slug: string }) => {
    setCategoryList((prev) => [...prev, { id: cat.id, name: cat.name }]);
    form.setValue("categoryId", cat.id, { shouldValidate: true });
  };

  const onSubmit = async (values: FormValues) => {
    const result =
      mode === "create"
        ? await createProduct(values)
        : await updateProduct({ ...values, id: defaultValues?.id! });

    if (result?.data) {
      toast.success(
        mode === "create" ? "Producto creado exitosamente" : "Producto actualizado",
      );
      router.push("/admin/productos");
    } else if (result?.serverError) {
      const isSlugError = result.serverError.toLowerCase().includes("slug");
      if (isSlugError) {
        form.setError("slug", { message: result.serverError });
        setActiveTab("basico");
      }
      toast.error(result.serverError);
    } else if (result?.validationErrors) {
      toast.error("Error de validación en el servidor");
    } else {
      toast.error("Error al guardar el producto");
    }
  };

  const errors = form.formState.errors;
  const basicHasError = !!(errors.name || errors.slug || errors.description || errors.categoryId);
  const pricingHasError = !!(errors.price || errors.stock);
  const mediaHasError = !!errors.images;
  const specsHasError = !!errors.specifications;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="basico" className="relative">
              Básico
              {basicHasError && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
              )}
            </TabsTrigger>
            <TabsTrigger value="precios" className="relative">
              Precios
              {pricingHasError && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
              )}
            </TabsTrigger>
            <TabsTrigger value="media" className="relative">
              Imágenes
              {mediaHasError && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
              )}
            </TabsTrigger>
            <TabsTrigger value="specs" className="relative">
              Especificaciones
              {specsHasError && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basico" className="mt-6">
            <ProductTabBasic
              categories={categoryList}
              onNameChange={handleNameChange}
              onCategoryCreated={handleCategoryCreated}
            />
          </TabsContent>

          <TabsContent value="precios" className="mt-6">
            <ProductTabPricing />
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <ProductTabMedia />
          </TabsContent>

          <TabsContent value="specs" className="mt-6">
            <ProductTabSpecs />
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 border-t pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {mode === "create" ? "Crear producto" : "Guardar cambios"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
