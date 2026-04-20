"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function parseNumberInput(value: string, valueAsNumber: number) {
  return value === "" || Number.isNaN(valueAsNumber) ? "" : valueAsNumber;
}

function toNumberInputValue(value: unknown) {
  if (value === "") return "";

  return typeof value === "number" && !Number.isNaN(value) ? value : "";
}

export function ProductTabPricing() {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio (ARS)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  className="min-h-11"
                  {...field}
                  value={toNumberInputValue(field.value)}
                  onChange={(e) =>
                    field.onChange(parseNumberInput(e.target.value, e.target.valueAsNumber))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  className="min-h-11"
                  {...field}
                  value={toNumberInputValue(field.value)}
                  onChange={(e) =>
                    field.onChange(parseNumberInput(e.target.value, e.target.valueAsNumber))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-text-primary">
            Dimensiones para envío
          </h3>
          <p className="text-sm text-muted-foreground">
            Se usan para cotizar e importar envíos con Correo Argentino.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="shippingWeightGrams"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso (gramos)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    className="min-h-11"
                    {...field}
                    value={toNumberInputValue(field.value)}
                    onChange={(e) =>
                      field.onChange(parseNumberInput(e.target.value, e.target.valueAsNumber))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shippingHeightCm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alto (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    className="min-h-11"
                    {...field}
                    value={toNumberInputValue(field.value)}
                    onChange={(e) =>
                      field.onChange(parseNumberInput(e.target.value, e.target.valueAsNumber))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shippingWidthCm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ancho (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    className="min-h-11"
                    {...field}
                    value={toNumberInputValue(field.value)}
                    onChange={(e) =>
                      field.onChange(parseNumberInput(e.target.value, e.target.valueAsNumber))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shippingLengthCm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Largo (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    className="min-h-11"
                    {...field}
                    value={toNumberInputValue(field.value)}
                    onChange={(e) =>
                      field.onChange(parseNumberInput(e.target.value, e.target.valueAsNumber))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
