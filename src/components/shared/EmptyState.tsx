// Server Component
import { TableCell, TableRow } from "@/components/ui/table";

interface EmptyStateProps {
  colSpan: number;
  message?: string;
}

export function EmptyState({ colSpan, message = "No hay registros todavía" }: EmptyStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-10 text-center text-muted-foreground">
        {message}
      </TableCell>
    </TableRow>
  );
}
