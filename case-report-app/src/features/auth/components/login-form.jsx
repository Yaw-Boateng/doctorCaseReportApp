// src/features/auth/components/login-form.jsx
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";

export function LoginForm({ onLogin, setView }) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Email Address</label>
        <input
          type="email"
          placeholder="name@example.com"
          className="h-11 px-3 rounded-xl border border-input bg-input text-foreground text-sm placeholder:text-muted-foreground"
          defaultValue="doctor@hospital.com"
        />
      </div>
      <PasswordInput
        label="Password"
        id="login-password"
        placeholder="Enter your password"
        defaultValue=""
      />

      <div className="text-xs text-center font-semibold text-muted-foreground my-1">
        💡 TEST LOGIN CHANNELS
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={() => onLogin("admin")}
          size="sm"
          variant="outline"
          className="border-amber-500 hover:bg-amber-500/10"
        >
          Admin
        </Button>
        <Button
          onClick={() => onLogin("worker")}
          size="sm"
          variant="outline"
          className="border-blue-500 hover:bg-blue-500/10"
        >
          Worker
        </Button>
        <Button
          onClick={() => onLogin("manager")}
          size="sm"
          variant="outline"
          className="border-emerald-500 hover:bg-emerald-500/10"
        >
          Manager
        </Button>
      </div>

      <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 border-t border-border pt-4">
        <button onClick={() => setView("Register")} className="hover:underline">
          Create Account
        </button>
        <button
          onClick={() => setView("Forgot Password")}
          className="hover:underline"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
}
