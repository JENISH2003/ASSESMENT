import { cn } from "../../lib/utils";

export default function ErrorMessage({ message, className }) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 animate-fade-in",
        className
      )}
    >
      {message}
    </div>
  );
}
