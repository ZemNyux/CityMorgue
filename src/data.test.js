import { describe, test, expect } from "vitest";
import { products } from "./data.js";

describe("Products Data", () => {
    test("products list is non-empty array", () => {
        expect(Array.isArray(products)).toBe(true);
        expect(products.length).toBeGreaterThan(0);
    });

    test("every product has required fields", () => {
        products.forEach((product) => {
            expect(product).toHaveProperty("id");
            expect(product).toHaveProperty("name");
            expect(product).toHaveProperty("price");
        });
    });
});