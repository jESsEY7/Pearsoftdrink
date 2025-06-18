import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "./WhatsAppButton";

interface HeroSectionProps {
  onShopNow: () => void;
}

export function HeroSection({ onShopNow }: HeroSectionProps) {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 via-green-800/60 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading with Animation */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-in slide-in-from-bottom duration-1000">
            GINI WASEKAO: <span className="text-orange-400 animate-pulse">PAYA!</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto animate-in slide-in-from-bottom duration-1000 delay-200">
            Premium Energy & Soft Drinks for the Youth Community
          </p>
          
          {/* Description */}
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-200 animate-in slide-in-from-bottom duration-1000 delay-400">
            Choose Paya for the energy to achieve your dreams, free from distractions. 
            Join our healthy lifestyle movement.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom duration-1000 delay-600">
            <Button 
              onClick={onShopNow}
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-300"
            >
              Shop Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <WhatsAppButton 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-green-800 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
            >
              Join Community
            </WhatsAppButton>
          </div>
        </div>
      </div>
      
      {/* Floating Animation Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-ping" />
        </div>
      </div>
    </section>
  );
}
