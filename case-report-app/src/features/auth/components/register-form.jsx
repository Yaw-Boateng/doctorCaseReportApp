import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";

export function RegisterForm({ setView }) {
  return (
    <form
      className="flex flex-col gap-4 w-full max-w-sm"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Full Name</label>
        <input
          type="text"
          placeholder="Dr. John Doe"
          className="h-11 px-3 rounded-xl border border-input bg-input text-foreground text-sm placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Email Address</label>
        <input
          type="email"
          placeholder="doctor@hospital.com"
          className="h-11 px-3 rounded-xl border border-input bg-input text-foreground text-sm placeholder:text-muted-foreground"
        />
      </div>
      <PasswordInput
        label="Password"
        id="register-password"
        placeholder="Create a strong password"
      />
      <Button type="submit" className="w-full mt-2">
        Create Account
      </Button>
      <button
        onClick={() => setView("Login")}
        className="text-xs text-muted-foreground hover:underline mt-4 block text-center w-full"
      >
        Back to Login
      </button>
    </form>
  );
}
