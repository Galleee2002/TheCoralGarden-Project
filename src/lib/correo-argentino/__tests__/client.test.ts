import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getCorreoArgentinoAgencies,
  getCorreoArgentinoTracking,
  importOrderShipmentToCorreoArgentino,
  quoteCorreoArgentinoShipping,
  resetCorreoArgentinoAuthCacheForTests,
  toCorreoProvinceCode,
} from "../client";

const originalEnv = process.env;

function jsonResponse(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    status: init?.status ?? 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("Correo Argentino client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    process.env = {
      ...originalEnv,
      CORREO_ARGENTINO_BASE_URL: "https://correo.test",
      CORREO_ARGENTINO_API_USER: "api-user",
      CORREO_ARGENTINO_API_PASSWORD: "api-pass",
      CORREO_ARGENTINO_MICORREO_EMAIL: "seller@example.com",
      CORREO_ARGENTINO_MICORREO_PASSWORD: "seller-pass",
      CORREO_ARGENTINO_ORIGIN_POSTAL_CODE: "1757",
      CORREO_ARGENTINO_DEFAULT_WEIGHT: "2500",
      CORREO_ARGENTINO_DEFAULT_HEIGHT: "10",
      CORREO_ARGENTINO_DEFAULT_WIDTH: "20",
      CORREO_ARGENTINO_DEFAULT_LENGTH: "30",
    };
    resetCorreoArgentinoAuthCacheForTests();
  });

  it("normalizes Argentine province names to Correo codes", () => {
    expect(toCorreoProvinceCode("Córdoba")).toBe("X");
    expect(toCorreoProvinceCode("Ciudad Autónoma de Buenos Aires")).toBe("C");
    expect(toCorreoProvinceCode("Provincia de Buenos Aires")).toBe("B");
  });

  it("authenticates dynamically before requesting rates", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ token: "jwt-token" }))
      .mockResolvedValueOnce(jsonResponse({ customerId: "0090000025" }))
      .mockResolvedValueOnce(
        jsonResponse({
          validTo: "2026-04-20T12:00:00.000-03:00",
          rates: [
            {
              deliveredType: "D",
              productType: "CP",
              productName: "Correo Argentino Clasico",
              price: 498.06,
              deliveryTimeMin: "2",
              deliveryTimeMax: "5",
            },
          ],
        })
      );
    vi.stubGlobal("fetch", fetchMock);

    const rates = await quoteCorreoArgentinoShipping({
      postalCodeDestination: "1704",
      deliveredType: "D",
    });

    expect(rates[0]).toMatchObject({
      deliveredType: "D",
      productType: "CP",
      price: 498.06,
    });
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://correo.test/token",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          authorization: expect.stringMatching(/^Basic /),
        }),
      })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://correo.test/users/validate",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ authorization: "Bearer jwt-token" }),
      })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "https://correo.test/rates",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          customerId: "0090000025",
          postalCodeOrigin: "1757",
          postalCodeDestination: "1704",
          deliveredType: "D",
          dimensions: {
            weight: 2500,
            height: 10,
            width: 20,
            length: 30,
          },
        }),
      })
    );
  });

  it("loads active agencies for a province", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(jsonResponse({ token: "jwt-token" }))
        .mockResolvedValueOnce(jsonResponse({ customerId: "0090000025" }))
        .mockResolvedValueOnce(
          jsonResponse([
            {
              code: "B0107",
              name: "Monte Grande",
              status: "ACTIVE",
              location: { address: { city: "Esteban Echeverria" } },
            },
          ])
        )
    );

    const agencies = await getCorreoArgentinoAgencies("Buenos Aires");

    expect(agencies).toEqual([
      expect.objectContaining({
        code: "B0107",
        name: "Monte Grande",
        status: "ACTIVE",
      }),
    ]);
  });

  it("imports an order and returns tracking data when present", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(jsonResponse({ token: "jwt-token" }))
        .mockResolvedValueOnce(jsonResponse({ customerId: "0090000025" }))
        .mockResolvedValueOnce(
          jsonResponse({
            createdAt: "2026-04-20T12:00:00.000-03:00",
            trackingNumber: "000500076393019A3G0C701",
          })
        )
    );

    const imported = await importOrderShipmentToCorreoArgentino({
      id: "order-12345678",
      customerName: "Juan Garcia",
      customerEmail: "juan@example.com",
      customerPhone: "1165446544",
      customerStreet: "Av. Corrientes",
      customerStreetNumber: "1234",
      customerCity: "Buenos Aires",
      customerProvince: "Buenos Aires",
      customerZip: "1425",
      total: 12000,
      shippingDeliveryType: "S",
      shippingProductType: "CP",
      shippingAgency: "B0107",
    });

    expect(imported).toMatchObject({
      deliveryType: "S",
      productType: "CP",
      trackingNumber: "000500076393019A3G0C701",
    });
  });

  it("parses tracking object responses and chooses the newest dated event", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(jsonResponse({ token: "jwt-token" }))
        .mockResolvedValueOnce(jsonResponse({ customerId: "0090000025" }))
        .mockResolvedValueOnce(
          jsonResponse({
            trackingNumber: "000500076393019A3G0C701",
            events: [
              { event: "PREIMPOSICION", date: "28-08-2024 10:33" },
              { event: "CADUCA", date: "09-12-2024 05:00" },
            ],
          })
        )
    );

    const tracking = await getCorreoArgentinoTracking("order-12345678");

    expect(tracking).toMatchObject({
      trackingNumber: "000500076393019A3G0C701",
      lastEvent: "CADUCA",
    });
  });
});
