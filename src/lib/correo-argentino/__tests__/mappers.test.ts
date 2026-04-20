import { describe, expect, it } from "vitest";
import {
  buildImportRequest,
  buildRateRequest,
  selectBestRate,
} from "@/lib/correo-argentino/mappers";
import type { CorreoArgentinoQuotePayload } from "@/lib/correo-argentino/types";

describe("correo argentino mappers", () => {
  it("aggregates cart dimensions for a home-delivery quote", () => {
    const request = buildRateRequest({
      customerId: "customer-1",
      postalCodeOrigin: "1001",
      postalCodeDestination: "B1842ZAB",
      products: [
        {
          id: "prod-1",
          name: "Filtro",
          shippingWeightGrams: 1200,
          shippingHeightCm: 10,
          shippingWidthCm: 30,
          shippingLengthCm: 40,
        },
        {
          id: "prod-2",
          name: "Bomba",
          shippingWeightGrams: 800,
          shippingHeightCm: 15,
          shippingWidthCm: 20,
          shippingLengthCm: 25,
        },
      ],
      items: [
        { productId: "prod-1", quantity: 2 },
        { productId: "prod-2", quantity: 1 },
      ],
    });

    expect(request).toEqual({
      customerId: "customer-1",
      postalCodeOrigin: "1001",
      postalCodeDestination: "B1842ZAB",
      deliveredType: "D",
      dimensions: {
        weight: 3200,
        height: 35,
        width: 30,
        length: 40,
      },
    });
  });

  it("chooses the cheapest home-delivery rate and breaks ties by delivery time", () => {
    const rate = selectBestRate([
      {
        deliveredType: "D",
        productType: "CP",
        productName: "Clasico",
        price: 5500,
        deliveryTimeMin: "3",
        deliveryTimeMax: "6",
      },
      {
        deliveredType: "D",
        productType: "CP",
        productName: "Express",
        price: 5500,
        deliveryTimeMin: "2",
        deliveryTimeMax: "4",
      },
      {
        deliveredType: "D",
        productType: "CP",
        productName: "Promo",
        price: 4900,
        deliveryTimeMin: "4",
        deliveryTimeMax: "7",
      },
    ]);

    expect(rate.productName).toBe("Promo");
  });

  it("maps an order and stored quote into the shipping/import payload", () => {
    const quotePayload = {
      request: {
        customerId: "customer-1",
        postalCodeOrigin: "1001",
        postalCodeDestination: "B1842ZAB",
        deliveredType: "D",
        dimensions: {
          weight: 3200,
          height: 35,
          width: 30,
          length: 40,
        },
      },
      selectedRate: {
        price: 4900,
        productType: "CP",
        productName: "Promo",
        deliveryTimeMin: "4",
        deliveryTimeMax: "7",
        validTo: "2026-04-16T13:00:00.000-03:00",
      },
      response: {},
    } as CorreoArgentinoQuotePayload;

    const payload = buildImportRequest({
      order: {
        id: "order-1",
        customerName: "Juan Garcia",
        customerEmail: "juan@example.com",
        customerPhone: "1166667777",
        customerStreet: "Av. Corrientes 1234",
        customerCity: "Buenos Aires",
        customerProvince: "C",
        customerZip: "C1001ABC",
        subtotal: 150000 as never,
      },
      quotePayload,
      settings: {
        customerId: "customer-1",
        senderName: "The Coral Garden",
        senderEmail: "logistica@example.com",
        senderPhone: "1144445555",
        originStreet: "Florida",
        originStreetNumber: "123",
        originFloor: null,
        originApartment: null,
        originCity: "CABA",
        originProvinceCode: "C",
        originPostalCode: "1001",
      },
    });

    expect(payload.extOrderId).toBe("order-1");
    expect(payload.shipping.productType).toBe("CP");
    expect(payload.shipping.address.streetName).toBe("Av. Corrientes");
    expect(payload.shipping.address.streetNumber).toBe("1234");
    expect(payload.shipping.weight).toBe(3200);
  });
});
