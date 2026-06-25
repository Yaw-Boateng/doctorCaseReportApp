import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import auth from "@/lib/auth";
import { useNavigate } from "react-router-dom";

export function RegisterForm({ setView }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "WORKER",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side check to ensure passwords match before sending to API
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await auth.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      navigate("/login");
    } catch (err) {
      console.error("Registration failed", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      {error && (
        <div className="text-sm text-destructive font-medium bg-destructive/10 p-2.5 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Name Input Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            className="h-10 sm:h-11 px-3 rounded-lg border border-input bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            className="h-10 sm:h-11 px-3 rounded-lg border border-input bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
            required
          />
        </div>
      </div>

      {/* Email Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="doctor@hospital.com"
          value={formData.email}
          onChange={handleChange}
          className="h-10 sm:h-11 px-3 rounded-lg border border-input bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
          required
        />
      </div>

      {/* Phone Number Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          placeholder="+233 24 000 0000"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="h-10 sm:h-11 px-3 rounded-lg border border-input bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
          required
        />
      </div>

      {/* Role Selection Dropdown */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="h-10 sm:h-11 px-3 rounded-lg border border-input bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
          required
        >
          <option value="WORKER">Worker</option>
          <option value="MANAGER">Manager</option>
        </select>
      </div>

      {/* Password Input */}
      <div className="flex flex-col gap-2">
        <PasswordInput
          label="Password"
          id="register-password"
          name="password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {/* Confirm Password Input */}
      <div className="flex flex-col gap-2">
        <PasswordInput
          label="Confirm Password"
          id="register-confirm-password"
          name="confirmPassword"
          placeholder="Repeat your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 rounded-full animate-spin border-primary/20 border-t-primary border-2" />
            Creating…
          </span>
        ) : (
          "Create Account"
        )}
      </Button>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="text-xs text-muted-foreground hover:underline mt-4 block text-center w-full"
      >
        Back to Login
      </button>
    </form>
  );
}
