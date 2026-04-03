import { cn } from "../../lib/utils";

export default function Loader({ size = "md", className }) {
  const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12"
  };

  return (
    <div
      className={cn(
        "custom-loader",
        sizeClasses[size],
        className
      )}
    />
  );
}
