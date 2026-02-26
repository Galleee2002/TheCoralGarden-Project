"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import { z } from "zod";
import { TechnicalServiceUseCase } from "@/types/enums";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createTechnicalServiceRequest } from "@/features/technical-service/actions/createTechnicalServiceRequest";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(6, "Teléfono requerido"),
  equipmentBrand: z.string().min(1, "Marca requerida"),
  useCase: z.enum([
    "ACUARISMO",
    "CULTIVO_INDOOR",
    "DOMESTICO",
    "COMERCIAL",
    "INDUSTRIAL",
  ] as const),
  issueDescription: z.string().min(10, "Describí el problema (mínimo 10 caracteres)"),
});

type FormValues = z.infer<typeof formSchema>;

const useCaseLabels: Record<TechnicalServiceUseCase, string> = {
  ACUARISMO: "Acuarismo",
  CULTIVO_INDOOR: "Cultivo Indoor",
  DOMESTICO: "Uso Doméstico",
  COMERCIAL: "Comercial",
  INDUSTRIAL: "Industrial",
};

export function TechnicalServiceForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      equipmentBrand: "",
      issueDescription: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const result = await createTechnicalServiceRequest(values);
    if (result?.data) {
      setSubmitted(true);
      toast.success("Solicitud enviada. Te contactamos a la brevedad.");
      form.reset();
    } else {
      toast.error("Error al enviar la solicitud. Intentá de nuevo.");
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border bg-green-50 p-10 text-center">
        <div className="text-5xl">✅</div>
        <h3 className="text-xl font-semibold text-green-800">
          Solicitud enviada exitosamente
        </h3>
        <p className="text-green-700">
          Nos pondremos en contacto a la brevedad para coordinar el servicio.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Enviar otra solicitud
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input placeholder="Juan García" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="juan@email.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono / WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="+54 9 11 ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="equipmentBrand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca del equipo</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Aquatek, Osmosis Pro..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="useCase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de uso</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná el tipo de uso" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(useCaseLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="issueDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción del problema</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describí el problema con el mayor detalle posible..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Enviar solicitud
        </Button>
      </form>
    </Form>
  );
}
