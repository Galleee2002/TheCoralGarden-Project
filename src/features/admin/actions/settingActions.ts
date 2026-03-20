"use server";

import { adminAction as action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma/client";
import { z } from "zod";

export const getSetting = async (key: string): Promise<string | null> => {
  const setting = await prisma.siteSetting.findUnique({ where: { key } });
  return setting?.value ?? null;
};

export const upsertSetting = action
  .schema(z.object({ key: z.string(), value: z.string() }))
  .action(async ({ parsedInput }) => {
    await prisma.siteSetting.upsert({
      where: { key: parsedInput.key },
      update: { value: parsedInput.value },
      create: { key: parsedInput.key, value: parsedInput.value },
    });
    return { success: true };
  });
