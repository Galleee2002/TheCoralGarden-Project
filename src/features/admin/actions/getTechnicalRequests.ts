import { prisma } from "@/lib/prisma/client";
import type { TechnicalServiceStatus } from "@/types/enums";

interface GetTechnicalRequestsParams {
  status?: TechnicalServiceStatus;
  page?: number;
  pageSize?: number;
}

export async function getTechnicalRequests({
  status,
  page = 1,
  pageSize = 20,
}: GetTechnicalRequestsParams = {}) {
  const where = status ? { status } : {};

  const [requests, total] = await Promise.all([
    prisma.technicalServiceRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.technicalServiceRequest.count({ where }),
  ]);

  return { requests, total, totalPages: Math.ceil(total / pageSize) };
}
