import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api"; 

export function OtpForm() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve the email passed from forgot-password screen
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Session expired. Please request a new code.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Hits POST /api/v1/auth/verify-otp
      await authApi.post("/verify-otp", { email, otp });
      
      // Advance to reset password form while moving the data context along safely
      navigate("/reset-password", { state: { email, otp } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid or expired OTP verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      <p className="text-sm text-muted-foreground">
        We have sent a verification code to <span className="font-medium text-foreground">{email || "your email"}</span>.
      </p>

      {error && (
        <div className="p-3 text-xs rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Verification Code</label>
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Only allow digits
          className="h-10 sm:h-11 px-3 tracking-widest text-center font-mono text-lg rounded-lg border border-input bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
          required
        />
      </div>

      <Button type="submit" className="w-full mt-2" disabled={loading || otp.length < 6}>
        {loading ? "Verifying Code…" : "Verify Code"}
      </Button>

      <button
        type="button"
        onClick={() => navigate("/forgot-password")}
        className="text-xs text-muted-foreground hover:underline mt-2 block text-center w-full"
      >
        Resend a new code
      </button>
    </form>
  );
}