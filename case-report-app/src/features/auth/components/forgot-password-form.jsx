import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/use-auth";
import { useToast } from "@/components/ToastContext";

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await forgotPassword(email);
      
      addToast({
        type: "success",
        title: "Code Sent",
        description: "A 6-digit verification code has been sent to your email.",
        duration: 4000
      });

      // Brief delay so the user registers the success before navigation
      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 400);

    } catch (err) {
      console.error("Forgot Password submission failed:", err);
      addToast({
        type: "error",
        title: "Failed to send code",
        description: err.response?.data?.message || "Something went wrong. Please check your email and try again.",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-5 w-full text-foreground" onSubmit={handleSubmit}>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Enter your email address and we'll send you a 6-digit verification code to reset your password.
      </p>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium tracking-wide">Email Address</label>
        <input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="h-11 px-3.5 rounded-xl border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background transition-shadow disabled:opacity-50"
          required
        />
      </div>

      <div className="mt-2">
        <Button type="submit" className="w-full h-11 rounded-xl font-medium shadow-sm transition-all active:scale-[0.98]" disabled={loading}>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 rounded-full animate-spin border-current border-t-transparent border-2" />
              Sending Code…
            </span>
          ) : (
            "Send Verification Code"
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