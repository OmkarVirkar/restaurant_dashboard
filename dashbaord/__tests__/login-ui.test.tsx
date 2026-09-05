import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RestaurantLogin } from "../components/restaurant-login";
import { describe, expect, it } from "vitest";

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

  it("opens, submits, and closes the request access popup", async () => {
    const user = userEvent.setup();

    render(<RestaurantLogin />);

    await user.click(screen.getByRole("button", { name: /request admin invite/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Request admin access" })).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    await user.type(within(dialog).getByLabelText("Full name"), "Chef Example");
    await user.type(within(dialog).getByLabelText("Email address"), "chef@example.com");
    await user.type(within(dialog).getByLabelText("Why do you need access?"), "I manage the evening service.");
    await user.click(within(dialog).getByRole("button", { name: "Send request" }));

    expect(screen.getByRole("heading", { name: "Request sent" })).toBeInTheDocument();
    expect(screen.getByText("We will be in touch after reviewing your request.")).toBeInTheDocument();

    await user.click(within(screen.getByRole("dialog")).getAllByRole("button", { name: "Close" })[1]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
