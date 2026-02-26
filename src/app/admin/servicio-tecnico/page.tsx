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
import type { TechnicalServiceStatus, TechnicalServiceUseCase } from "@/types/enums";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Servicio Técnico" };

const statusLabels: Record<TechnicalServiceStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Pendiente", variant: "secondary" },
  CONTACTED: { label: "Contactado", variant: "default" },
  IN_PROGRESS: { label: "En progreso", variant: "default" },
  RESOLVED: { label: "Resuelto", variant: "outline" },
};

const useCaseLabels: Record<TechnicalServiceUseCase, string> = {
  ACUARISMO: "Acuarismo",
  CULTIVO_INDOOR: "Cultivo Indoor",
  DOMESTICO: "Doméstico",
  COMERCIAL: "Comercial",
  INDUSTRIAL: "Industrial",
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
      <h1 className="mb-6 text-2xl font-bold">Solicitudes de Servicio Técnico</h1>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
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
                const status = statusLabels[req.status];
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
                      <Badge variant="secondary">
                        {useCaseLabels[req.useCase]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
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
