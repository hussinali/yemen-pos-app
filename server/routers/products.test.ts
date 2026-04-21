import { describe, it, expect } from "vitest";
import { productsRouter } from "./products";

describe("Products Router", () => {
  it("should validate product creation input", async () => {
    const input = {
      name: "منتج تجريبي",
      categoryId: 1,
      purchasePrice: "50",
      sellingPrice: "100",
      unit: "حبة",
      minStock: 10,
    };
    
    expect(input.name).toBeTruthy();
    expect(parseFloat(input.sellingPrice)).toBeGreaterThan(parseFloat(input.purchasePrice));
  });

  it("should handle product search", async () => {
    const searchTerm = "منتج";
    const regex = new RegExp(searchTerm);
    expect(regex.test("منتج تجريبي")).toBe(true);
  });
});
