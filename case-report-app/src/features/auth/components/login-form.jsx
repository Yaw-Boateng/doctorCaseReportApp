import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "../context/use-auth";
import { useToast } from "@/components/ToastContext"; // 👈 1. Import the toast hook

export function LoginForm() {
  const { login } = useAuth(); 
  const navigate = useNavigate();
  const { addToast } = useToast(); // 👈 2. Initialize addToast
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    
    try {
      const verifiedRole = await login(email, password);
      
      // 👈 3. Trigger premium success toast on successful login
      addToast({
        type: "success",
        title: "Authenticated successfully",
        description: `Welcome back! Navigating to your secure ${verifiedRole} portal.`,
        duration: 3500
      });

      // Let the user visually process the crisp toast layout momentarily before shifting routes
      setTimeout(() => {
        if (verifiedRole === "admin") {
          navigate("/admin", { replace: true });
        } else if (verifiedRole === "manager") {
          navigate("/manager", { replace: true });
        } else {
          navigate("/doctor", { replace: true });
        }
      }, 400);
      
    } catch (err) {
      console.error("Login component catch block triggered:", err);
      const errorMessage = err.response?.data?.message || err.message || "Invalid email or password.";
      
      // 👈 4. Seamlessly trigger an error toast instead of an ugly layout shift
      addToast({
        type: "error",
        title: "Sign in failed",
        description: errorMessage,
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-5 w-full text-foreground" onSubmit={submit}>
      
      {/* EMAIL FIELD */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium tracking-wide">Email Address</label>
        <input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 px-3.5 rounded-xl border border-border bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background transition-shadow"
          required
        />
      </div>

      {/* PASSWORD FIELD */}
      <PasswordInput
        label="Password"
        id="login-password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* SUBMIT BUTTON */}
      <div className="mt-2">
        <Button 
          type="submit" 
          className="w-full h-11 rounded-xl font-medium shadow-sm transition-all active:scale-[0.98]" 
          disabled={loading}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 rounded-full animate-spin border-current border-t-transparent border-2" />
              Signing in…
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </div>

      {/* AUXILIARY LINKS */}
      <div className="flex flex-row justify-between items-center gap-3 text-xs font-medium text-muted-foreground mt-2 border-t border-border/60 pt-4">
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="hover:text-primary transition-colors text-left"
        >
          Create Account
        </button>
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="hover:text-primary transition-colors text-right"
        >
          Forgot Password?
        </button>
      </div>
    </form>
  );
}