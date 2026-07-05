import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import auth from "@/lib/auth";
import { useToast } from "@/components/ToastContext"; // 👈 1. Import the hook

export function RegisterForm() {
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

  const navigate = useNavigate();
  const { addToast } = useToast(); // 👈 2. Initialize addToast

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password matching validation error toast
    if (formData.password !== formData.confirmPassword) {
      addToast({
        type: "error",
        title: "Registration mismatch",
        description: "Your passwords do not match. Please verify and try again.",
        duration: 4000
      });
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

      // 👈 3. Trigger premium semantic success toast
      addToast({
        type: "success",
        title: "Account created",
        description: "Registration complete! Redirecting you to the secure log in.",
        duration: 3000
      });

      // Give users a quick brief second to see the success toast track before page shifting
      setTimeout(() => {
        navigate("/login");
      }, 450);

    } catch (err) {
      console.error("Registration failed", err);
      const errorMessage = err.response?.data?.message || err.message || "Registration failed. Please try again.";
      
      // 👈 4. Trigger premium error toast for backend/network issues
      addToast({
        type: "error",
        title: "Registration failed",
        description: errorMessage,
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form className="flex flex-col gap-4 w-full text-foreground" onSubmit={handleSubmit}>
      
      {/* Name Input Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium tracking-wide">First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            className="h-11 px-3.5 rounded-xl border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background transition-shadow"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium tracking-wide">Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            className="h-11 px-3.5 rounded-xl border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background transition-shadow"
            required
          />
        </div>
      </div>

      {/* Email Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium tracking-wide">Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="doctor@hospital.com"
          value={formData.email}
          onChange={handleChange}
          className="h-11 px-3.5 rounded-xl border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background transition-shadow"
          required
        />
      </div>

      {/* Phone Number Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium tracking-wide">Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          placeholder="+233 24 000 0000"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="h-11 px-3.5 rounded-xl border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background transition-shadow"
          required
        />
      </div>

      {/* Role Selection Dropdown */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium tracking-wide">Role</label>
        <div className="relative">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full h-11 px-3.5 rounded-xl border border-border bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background transition-shadow cursor-pointer appearance-none"
            required
          >
            <option value="WORKER">Worker</option>
            <option value="MANAGER">Manager</option>
          </select>
          {/* Custom subtle chevron icon indicator arrow for select layout wrapper */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Password Inputs */}
      <PasswordInput
        label="Password"
        id="register-password"
        name="password"
        placeholder="Create a strong password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <PasswordInput
        label="Confirm Password"
        id="register-confirm-password"
        name="confirmPassword"
        placeholder="Repeat your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />

      {/* Action CTA Submission */}
      <div className="mt-2">
        <Button 
          type="submit" 
          className="w-full h-11 rounded-xl font-medium shadow-sm transition-all active:scale-[0.98]" 
          disabled={loading}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 rounded-full animate-spin border-current border-t-transparent border-2" />
              Creating Account…
            </span>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors mt-2 block text-center w-full border-t border-border/60 pt-4"
      >
        Back to Login
      </button>
    </form>
  );
}