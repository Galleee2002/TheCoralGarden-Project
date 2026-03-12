import { prisma } from "@/lib/prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { AdminPageHeader } from "@/components/shared/AdminPageHeader";
import { Package, ShoppingBag, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Dashboard" };

async function getDashboardStats() {
  const [totalOrders, totalProducts, revenue] =
    await Promise.all([
      prisma.order.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.order.aggregate({
        where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
        _sum: { total: true },
      }),
    ]);

  return { totalOrders, totalProducts, revenue };
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
      urgent: false,
    },
    {
      title: "Ingresos",
      value: formatCurrency(Number(stats.revenue._sum.total)),
      icon: TrendingUp,
      description: "Pagos confirmados",
      urgent: false,
    },
    {
      title: "Productos activos",
      value: stats.totalProducts.toString(),
      icon: Package,
      description: "En el catálogo",
      urgent: false,
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Resumen general del sitio"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card
            key={card.title}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="mt-2 text-3xl font-black font-heading text-text-primary leading-none">
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
                </div>
                <div
                  className={[
                    "h-11 w-11 rounded-card flex items-center justify-center shrink-0",
                    card.urgent ? "bg-destructive/10" : "bg-card-light",
                  ].join(" ")}
                >
                  <card.icon
                    className={[
                      "h-5 w-5",
                      card.urgent ? "text-destructive" : "text-bg-secondary",
                    ].join(" ")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
