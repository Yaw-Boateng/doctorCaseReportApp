import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/use-auth";

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Calls context wrapper which runs POST to /api/v1/auth/forgot-password
      await forgotPassword(email);
      
      // Redirect cleanly to OTP page, carrying along email state context
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      console.error("Forgot Password submission failed:", err);
      setError(err.response?.data?.message || "Something went wrong. Please check your email and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      <p className="text-sm text-muted-foreground">
        Enter your email address and we'll send you a 6-digit verification code to reset your password.
      </p>

      {error && (
        <div className="p-3 text-xs rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Email Address</label>
        <input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="h-10 sm:h-11 px-3 rounded-lg border border-input bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background disabled:opacity-50"
          required
        />
      </div>

      <Button type="submit" className="w-full mt-2" disabled={loading}>
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 rounded-full animate-spin border-primary/20 border-t-primary border-2" />
            Sending Code…
          </span>
        ) : (
          "Send Verification Code"
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