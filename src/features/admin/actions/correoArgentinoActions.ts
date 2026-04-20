"use server";

import { adminAction as action } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma/client";
import {
  CORREO_ARGENTINO_SETTING_KEYS,
  correoArgentinoSettingsSchema,
} from "@/lib/correo-argentino/settings";
import { resolveCorreoArgentinoCustomerId } from "@/lib/correo-argentino/service";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const upsertCorreoArgentinoSettings = action
  .schema(correoArgentinoSettingsSchema)
  .action(async ({ parsedInput }) => {
    const settings = [
      [CORREO_ARGENTINO_SETTING_KEYS.senderName, parsedInput.senderName],
      [CORREO_ARGENTINO_SETTING_KEYS.senderEmail, parsedInput.senderEmail],
      [CORREO_ARGENTINO_SETTING_KEYS.senderPhone, parsedInput.senderPhone],
      [CORREO_ARGENTINO_SETTING_KEYS.originStreet, parsedInput.originStreet],
      [
        CORREO_ARGENTINO_SETTING_KEYS.originStreetNumber,
        parsedInput.originStreetNumber,
      ],
      [CORREO_ARGENTINO_SETTING_KEYS.originFloor, parsedInput.originFloor || ""],
      [
        CORREO_ARGENTINO_SETTING_KEYS.originApartment,
        parsedInput.originApartment || "",
      ],
      [CORREO_ARGENTINO_SETTING_KEYS.originCity, parsedInput.originCity],
      [
        CORREO_ARGENTINO_SETTING_KEYS.originProvinceCode,
        parsedInput.originProvinceCode,
      ],
      [
        CORREO_ARGENTINO_SETTING_KEYS.originPostalCode,
        parsedInput.originPostalCode.trim().toUpperCase(),
      ],
    ] as const;

    await prisma.$transaction(
      settings.map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
    );

    revalidatePath("/admin/configuracion");

    return { success: true };
  });

export const syncCorreoArgentinoCustomerId = action
  .schema(z.object({}))
  .action(async () => {
    const customerId = await resolveCorreoArgentinoCustomerId();

    await prisma.siteSetting.upsert({
      where: { key: CORREO_ARGENTINO_SETTING_KEYS.customerId },
      update: { value: customerId },
      create: {
        key: CORREO_ARGENTINO_SETTING_KEYS.customerId,
        value: customerId,
      },
    });

    revalidatePath("/admin/configuracion");

    return { success: true, customerId };
  });
