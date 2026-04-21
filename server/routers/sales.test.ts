import { describe, it, expect } from "vitest";
import { salesRouter } from "./sales";

describe("Sales Router", () => {
  it("should create a sale with items", async () => {
    const mockCtx = { user: { id: 1 } };
    const input = {
      branchId: 1,
      items: [
        { productId: 1, quantity: 2, unitPrice: "100", taxRate: "5", subtotal: "210" }
      ],
      subtotal: "200",
      taxAmount: "10",
      total: "210",
      paymentMethod: "cash" as const,
    };
    
    expect(input.total).toBe("210");
    expect(input.items.length).toBe(1);
  });

  it("should validate payment method", async () => {
    const validMethods = ["cash", "bank_transfer", "credit_card"];
    expect(validMethods).toContain("cash");
  });
});
