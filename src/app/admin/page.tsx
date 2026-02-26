import { prisma } from "@/lib/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, Wrench, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Dashboard" };

async function getDashboardStats() {
  const [totalOrders, totalProducts, pendingTechnicalRequests, revenue] =
    await Promise.all([
      prisma.order.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.technicalServiceRequest.count({ where: { status: "PENDING" } }),
      prisma.order.aggregate({
        where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
        _sum: { total: true },
      }),
    ]);

  return { totalOrders, totalProducts, pendingTechnicalRequests, revenue };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const formatCurrency = (value: number | null) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value ?? 0);

  const cards = [
    {
      title: "Total órdenes",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      description: "Todas las órdenes",
    },
    {
      title: "Ingresos",
      value: formatCurrency(Number(stats.revenue._sum.total)),
      icon: TrendingUp,
      description: "Pagos confirmados",
    },
    {
      title: "Productos activos",
      value: stats.totalProducts.toString(),
      icon: Package,
      description: "En el catálogo",
    },
    {
      title: "Servicio técnico pendiente",
      value: stats.pendingTechnicalRequests.toString(),
      icon: Wrench,
      description: "Solicitudes sin atender",
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
