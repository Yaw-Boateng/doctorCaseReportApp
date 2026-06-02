import { Button } from "@/components/ui/button";

export function ForgotPasswordForm({ setView }) {
  return (
    <form
      className="flex flex-col gap-4 w-full max-w-sm"
      onSubmit={(e) => e.preventDefault()}
    >
      <p className="text-sm text-muted-foreground">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Email Address</label>
        <input
          type="email"
          placeholder="name@example.com"
          className="h-11 px-3 rounded-xl border border-input bg-input text-foreground text-sm placeholder:text-muted-foreground"
        />
      </div>
      <Button type="submit" className="w-full mt-2">
        Send Reset Link
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
