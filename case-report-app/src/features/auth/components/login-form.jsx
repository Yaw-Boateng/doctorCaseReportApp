import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "../context/use-auth";

export function LoginForm() {
  const { login } = useAuth(); 
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      // Hits your global Context handler to log in via your Spring Boot API
      await login(email, password);
      // Note: Redirection to dashboards happens automatically inside App.jsx 
      // as soon as the global authenticated state changes.
    } catch (err) {
      // TODO: Surface error to user (toast)
      console.error("Login component catch block triggered:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={submit}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Email Address</label>
        <input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 sm:h-11 px-3 rounded-lg border border-input bg-input text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
          required
        />
      </div>

      <PasswordInput
        label="Password"
        id="login-password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground mt-4 border-t border-border pt-4">
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="hover:underline w-full sm:w-auto text-center"
        >
          Create Account
        </button>
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="hover:underline w-full sm:w-auto text-center"
        >
          Forgot Password?
        </button>
      </div>

      <div className="mt-4">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 rounded-full animate-spin border-primary/20 border-t-primary border-2" />
              Signing in…
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
      </div>
    </form>
  );
}