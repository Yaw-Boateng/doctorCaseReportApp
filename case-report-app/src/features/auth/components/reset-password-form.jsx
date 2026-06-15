import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "../context/use-auth";

export function ResetPasswordForm() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      setStatus({ type: "error", message: "Session missing parameters. Please restart request." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // Hits POST /api/v1/auth/reset-password
      await resetPassword(email, otp, newPassword, confirmPassword);
      
      setStatus({ type: "success", message: "Password updated successfully! Routing to login..." });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error(err);
      setStatus({ 
        type: "error", 
        message: err.response?.data?.message || "Failed to update password. Try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      <p className="text-sm text-muted-foreground">
        Set up a strong, secure new password for your access portal profile.
      </p>

      {status.message && (
        <div className={`p-3 text-xs rounded-lg border ${
          status.type === "success" 
            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
            : "bg-destructive/10 text-destructive border-destructive/20"
        }`}>
          {status.message}
        </div>
      )}

      <PasswordInput
        label="New Password"
        id="new-password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />

      <PasswordInput
        label="Confirm New Password"
        id="confirm-password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <Button type="submit" className="w-full mt-2" disabled={loading || status.type === "success"}>
        {loading ? "Updating Credentials…" : "Reset Password"}
      </Button>
    </form>
  );
}