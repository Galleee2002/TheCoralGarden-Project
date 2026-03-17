"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function ProductTabSpecs() {
  const form = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "specifications",
  });

  const rootError = form.formState.errors.specifications?.root?.message as string | undefined;
  const arrayError = !Array.isArray(form.formState.errors.specifications)
    ? (form.formState.errors.specifications as { message?: string } | undefined)?.message
    : undefined;
  const specsError = rootError ?? arrayError;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Agregá las especificaciones técnicas del producto. Cada ítem aparecerá como un punto en la página de detalle.
      </p>
      {specsError && (
        <p className="text-sm font-medium text-destructive">{specsError}</p>
      )}

      <div className="space-y-2">
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={form.control}
            name={`specifications.${index}`}
            render={({ field: inputField }) => (
              <FormItem>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder={`Especificación ${index + 1}`}
                      {...inputField}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                    aria-label="Eliminar especificación"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append("")}
      >
        <Plus className="mr-2 h-4 w-4" />
        Agregar especificación
      </Button>
    </div>
  );
}
