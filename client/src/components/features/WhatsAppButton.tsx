import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  variant?: "default" | "outline" | "floating";
  size?: "sm" | "default" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function WhatsAppButton({ 
  variant = "default", 
  size = "default", 
  className,
  children = "Join Community"
}: WhatsAppButtonProps) {
  
  const openWhatsApp = () => {
    const message = encodeURIComponent(
      "GINI WASEKAO: PAYA! 🎉\n\n" +
      "Jokanyaka! Irogi okinyi gi mor! 👋\n\n" +
      "Hi! I'd like to join the Paya Youth Community. I'm interested in learning more about healthy living and your premium beverages!\n\n" +
      "Translation: Hey Youths! Good morning with joy! I want to be part of the healthy energy movement!"
    );
    
    // Replace with actual WhatsApp number when available
    const phoneNumber = "+254700000000";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  if (variant === "floating") {
    return (
      <Button
        onClick={openWhatsApp}
        className={cn(
          "fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full shadow-lg",
          "bg-green-500 hover:bg-green-600 text-white",
          "animate-bounce hover:animate-none",
          "transition-all duration-300 hover:shadow-xl hover:shadow-green-500/25",
          className
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Button
      onClick={openWhatsApp}
      variant={variant}
      size={size}
      className={cn(
        "inline-flex items-center",
        variant === "default" && "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-green-500/25",
        className
      )}
    >
      <MessageCircle className="w-4 h-4 mr-2" />
      {children}
    </Button>
  );
}
