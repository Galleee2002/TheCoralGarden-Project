import { getTechnicalRequests } from "@/features/admin/actions/getTechnicalRequests";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import type { TechnicalServiceStatus, TechnicalServiceUseCase } from "@/types/enums";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Servicio Técnico" };

const statusStyles: Record<TechnicalServiceStatus, { label: string; className: string }> = {
  PENDING:     { label: "Pendiente",   className: "bg-amber-100 text-amber-800 border border-amber-200" },
  CONTACTED:   { label: "Contactado",  className: "bg-blue-100 text-blue-800 border border-blue-200" },
  IN_PROGRESS: { label: "En progreso", className: "bg-violet-100 text-violet-800 border border-violet-200" },
  RESOLVED:    { label: "Resuelto",    className: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
};

const useCaseLabels: Record<TechnicalServiceUseCase, string> = {
  ACUARISMO:      "Acuarismo",
  CULTIVO_INDOOR: "Cultivo Indoor",
  DOMESTICO:      "Doméstico",
  COMERCIAL:      "Comercial",
  INDUSTRIAL:     "Industrial",
};

export default async function AdminTechnicalServicePage() {
  const { requests } = await getTechnicalRequests({ pageSize: 50 });

  const formatDate = (d: Date) =>
    new Intl.DateTimeFormat("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(d);

  return (
    <div>
      <AdminPageHeader
        title="Servicio Técnico"
        description="Solicitudes recibidas"
      />
      <div
        role="region"
        aria-label="Tabla de solicitudes de servicio técnico"
        className="overflow-x-auto rounded-card border border-border/50 shadow-sm"
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead>Uso</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-muted-foreground"
                >
                  No hay solicitudes todavía
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => {
                const status = statusStyles[req.status];
                return (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{req.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {req.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {req.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{req.equipmentBrand}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-normal">
                        {useCaseLabels[req.useCase]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          status.className,
                        ].join(" ")}
                      >
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(req.createdAt)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
