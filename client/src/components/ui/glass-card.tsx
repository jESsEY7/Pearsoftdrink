import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "dark";
}

export function GlassCard({ 
  className, 
  variant = "light", 
  children, 
  ...props 
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "backdrop-blur-lg border rounded-xl p-6",
        variant === "light" 
          ? "bg-white/25 border-white/18" 
          : "bg-black/20 border-white/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
