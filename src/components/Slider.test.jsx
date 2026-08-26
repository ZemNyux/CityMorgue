import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Slider } from "./Slider.jsx";

test("renders slider without crashing", () => {
    const mockSlides = [
        { id: "1", title: "Slide 1", image: "test1.jpg" },
        { id: "2", title: "Slide 2", image: "test2.jpg" }
    ];

    const { container } = render(<Slider slides={mockSlides} />);
    expect(container).toBeInTheDocument();
});