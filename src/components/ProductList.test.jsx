import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProductCard } from "./UI.jsx";
import { CartProvider } from "../context/AppContext.jsx";

test("renders product list items from data", () => {
    const mockProduct = {
        id: "tee-shinners",
        name: "Logo tee",
        price: 38,
        category: "tees",
        description: "Sample description"
    };

    render(
        <CartProvider>
            <ProductCard
                product={mockProduct}
                onDetails={() => {}}
            />
        </CartProvider>
    );

    expect(screen.getAllByText(/Logo tee/i)[0]).toBeInTheDocument();
});