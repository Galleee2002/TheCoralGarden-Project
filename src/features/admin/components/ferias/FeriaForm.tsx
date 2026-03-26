"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createFeria, updateFeria } from "@/features/ferias/actions/feriaActions";

const formSchema = z.object({
  title: z.string().min(2, "Mínimo 2 caracteres"),
  description: z.string().min(10, "Mínimo 10 caracteres"),
  imageUrl: z.string().url("Debe ser una URL válida"),
  date: z.string().min(1, "La fecha es requerida"),
});

type FormValues = z.infer<typeof formSchema>;

interface FeriaFormProps {
  mode: "create" | "edit";
  defaultValues?: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    date: string;
  };
}

export function FeriaForm({ mode, defaultValues }: FeriaFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      imageUrl: defaultValues?.imageUrl ?? "",
      date: defaultValues?.date ?? "",
    },
  });

  const imageUrl = form.watch("imageUrl");

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createFeria(values)
          : await updateFeria({ ...values, id: defaultValues!.id });

      if (result?.data) {
        toast.success(mode === "create" ? "Feria creada exitosamente" : "Feria actualizada");
        router.push("/admin/ferias");
        router.refresh();
      } else {
        toast.error("Error al guardar la feria");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Feria de acuarismo 2025" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Contá de qué se trató la feria, qué productos presentaron, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <ImageUploader
                    onUpload={(url) => field.onChange(url)}
                    label={imageUrl ? "Reemplazar imagen" : "Subir imagen"}
                  />
                  {imageUrl && (
                    <div className="relative h-48 w-full overflow-hidden rounded-card border border-border">
                      <Image
                        src={imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/ferias")}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Crear feria" : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
