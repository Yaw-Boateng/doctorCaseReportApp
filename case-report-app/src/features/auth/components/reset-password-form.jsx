import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "../context/use-auth";
import { useToast } from "@/components/ToastContext";

export function ResetPasswordForm() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      addToast({
        type: "warning",
        title: "Missing Parameters",
        description: "Session data lost. Please restart the password reset process.",
        duration: 5000
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast({
        type: "error",
        title: "Passwords mismatch",
        description: "The passwords you entered do not match.",
        duration: 4000
      });
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email, otp, newPassword, confirmPassword);
      
      addToast({
        type: "success",
        title: "Password Updated",
        description: "Your password was successfully reset! Redirecting to login...",
        duration: 3000
      });

      // Clear local states to avoid duplicate rapid submissions
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Update Failed",
        description: err.response?.data?.message || "Failed to update password. Try again.",
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-5 w-full text-foreground" onSubmit={handleSubmit}>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Set up a strong, secure new password for your access portal profile.
      </p>

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

      <div className="mt-2">
        <Button 
          type="submit" 
          className="w-full h-11 rounded-xl font-medium shadow-sm transition-all active:scale-[0.98]" 
          disabled={loading}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 rounded-full animate-spin border-current border-t-transparent border-2" />
              Updating Credentials…
            </span>
          ) : (
            "Reset Password"
          )}
        </Button>
      </div>
    </form>
  );
}