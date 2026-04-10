"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Archive, Loader2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type ConfirmDialogTone = "destructive" | "archival" | "blocked";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "default" | "destructive";
  onConfirm?: () => void;
  loading?: boolean;
  tone?: ConfirmDialogTone;
  impactTitle?: string;
  impactItems?: string[];
  secondaryLabel?: string;
  secondaryVariant?: "default" | "destructive" | "outline" | "secondary";
  onSecondaryAction?: () => void;
  hideConfirm?: boolean;
}

const toneConfig: Record<
  ConfirmDialogTone,
  { icon: typeof TriangleAlert; panelClassName: string; iconClassName: string }
> = {
  destructive: {
    icon: TriangleAlert,
    panelClassName: "border-destructive/20 bg-destructive/5",
    iconClassName: "text-destructive",
  },
  archival: {
    icon: Archive,
    panelClassName: "border-border bg-card-light/70",
    iconClassName: "text-bg-secondary",
  },
  blocked: {
    icon: TriangleAlert,
    panelClassName: "border-amber-200 bg-amber-50",
    iconClassName: "text-amber-700",
  },
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmVariant = "default",
  onConfirm,
  loading = false,
  tone = "destructive",
  impactTitle,
  impactItems,
  secondaryLabel,
  secondaryVariant = "secondary",
  onSecondaryAction,
  hideConfirm = false,
}: ConfirmDialogProps) {
  const toneMeta = toneConfig[tone];
  const ToneIcon = toneMeta.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {(impactTitle || (impactItems && impactItems.length > 0)) ? (
          <div
            className={cn(
              "rounded-card border p-4",
              toneMeta.panelClassName,
            )}
          >
            <div className="flex gap-3">
              <ToneIcon className={cn("mt-0.5 h-4 w-4 shrink-0", toneMeta.iconClassName)} />
              <div className="space-y-2">
                {impactTitle ? (
                  <p className="text-sm font-medium text-foreground">{impactTitle}</p>
                ) : null}
                {impactItems && impactItems.length > 0 ? (
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {impactItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          {secondaryLabel && onSecondaryAction ? (
            <Button
              type="button"
              variant={secondaryVariant}
              onClick={onSecondaryAction}
              disabled={loading}
            >
              {secondaryLabel}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          {!hideConfirm ? (
            <Button
              type="button"
              variant={confirmVariant}
              onClick={onConfirm}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {confirmLabel}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
