"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { CategoryDialog } from "@/features/admin/components/categories/CategoryDialog";

interface Category {
  id: string;
  name: string;
}

interface ProductTabBasicProps {
  categories: Category[];
  onNameChange?: (name: string) => void;
  onCategoryCreated?: (cat: { id: string; name: string; slug: string }) => void;
}

export function ProductTabBasic({
  categories,
  onNameChange,
  onCategoryCreated,
}: ProductTabBasicProps) {
  const form = useFormContext();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input
                  placeholder="Sistema de ósmosis inversa"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    onNameChange?.(e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug (URL)</FormLabel>
              <FormControl>
                <Input placeholder="sistema-osmosis-inversa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Textarea rows={4} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <FormLabel>Categoría</FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="min-h-11 px-2 text-xs text-muted-foreground hover:text-text-primary"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="mr-1 h-3 w-3" />
                Nueva categoría
              </Button>
            </div>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccioná una categoría" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex min-h-11 items-center gap-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-5 w-5 accent-primary"
                />
              </FormControl>
              <FormLabel className="!mt-0">Destacado</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex min-h-11 items-center gap-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-5 w-5 accent-primary"
                />
              </FormControl>
              <FormLabel className="!mt-0">Activo</FormLabel>
            </FormItem>
          )}
        />
      </div>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode="create"
        onSuccess={(cat) => {
          onCategoryCreated?.(cat);
          setDialogOpen(false);
        }}
      />
    </div>
  );
}
