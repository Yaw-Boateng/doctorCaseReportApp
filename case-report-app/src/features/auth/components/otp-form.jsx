import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api"; 
import { useToast } from "@/components/ToastContext";

export function OtpForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      addToast({
        type: "warning",
        title: "Session Expired",
        description: "Please request a new verification code.",
        duration: 4000
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await authApi.post("/verify-otp", { email, otp });
      
      addToast({
        type: "success",
        title: "Verified successfully",
        description: "Your code is valid. You may now reset your password.",
        duration: 3000
      });

      setTimeout(() => {
        navigate("/reset-password", { state: { email, otp } });
      }, 400);

    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Verification failed",
        description: err.response?.data?.message || "Invalid or expired OTP verification code.",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-5 w-full text-foreground" onSubmit={handleSubmit}>
      <p className="text-sm text-muted-foreground leading-relaxed">
        We have sent a verification code to <span className="font-semibold text-foreground">{email || "your email"}</span>.
      </p>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium tracking-wide">Verification Code</label>
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="h-11 px-3.5 tracking-[0.5em] text-center font-mono text-xl rounded-xl border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background placeholder:tracking-normal placeholder:text-sm placeholder:text-muted-foreground transition-shadow"
          required
        />
      </div>

      <div className="mt-2">
        <Button type="submit" className="w-full h-11 rounded-xl font-medium shadow-sm transition-all active:scale-[0.98]" disabled={loading || otp.length < 6}>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 rounded-full animate-spin border-current border-t-transparent border-2" />
              Verifying Code…
            </span>
          ) : (
            "Verify Code"
          )}
        </Button>
      </div>

      <button
        type="button"
        onClick={() => navigate("/forgot-password")}
        className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors mt-2 block text-center w-full border-t border-border/60 pt-4"
      >
        Resend a new code
      </button>
    </form>
  );
}