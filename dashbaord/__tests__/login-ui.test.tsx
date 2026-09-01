import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RestaurantLogin } from "../components/restaurant-login";

describe("Restaurant login UI", () => {
  it("renders the default English login screen", () => {
    render(<RestaurantLogin />);

    expect(screen.getByText("Welcome back, chef.")).toBeInTheDocument();
    expect(screen.getByText("Manage your restaurant")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in to dashboard/i })).toBeInTheDocument();
  });

  it("renders the Hindi version when locale is hi", () => {
    render(<RestaurantLogin locale="hi" />);

    expect(screen.getByText("फिर से स्वागत है, शेफ।")).toBeInTheDocument();
    expect(screen.getByText("अपने रेस्टोरेंट का प्रबंधन करें")).toBeInTheDocument();
    expect(screen.getByLabelText("ईमेल पता")).toBeInTheDocument();
    expect(screen.getByLabelText("पासवर्ड")).toBeInTheDocument();
  });

  it("supports typing credentials in the form fields", async () => {
    const user = userEvent.setup();

    render(<RestaurantLogin />);

    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "chef@restaurant.com");
    await user.type(passwordInput, "SuperSecret123!");

    expect(emailInput).toHaveValue("chef@restaurant.com");
    expect(passwordInput).toHaveValue("SuperSecret123!");
  });

  it("renders the language toggle links correctly", () => {
    render(<RestaurantLogin locale="en" />);

    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: "हिं" })).toHaveAttribute("href", "/login?locale=hi");
  });
});
