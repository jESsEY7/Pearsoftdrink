import { useState } from "react";
import { X, CreditCard, Smartphone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/features/Toast";
import { apiRequest } from "@/lib/queryClient";
import type { PaymentMethod } from "@/types";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    // M-Pesa
    phoneNumber: "",
    // Card
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    // Customer info
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  const { items, total, clearCart } = useCart();
  const { showToast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createOrder = async () => {
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total,
        paymentMethod,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: paymentMethod === "mpesa" ? formData.phoneNumber : formData.customerPhone,
        status: "pending"
      };

      const response = await apiRequest("POST", "/api/orders", orderData);
      return await response.json();
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const handleMpesaPayment = async () => {
    if (!formData.phoneNumber || !formData.customerName) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create order first
      const order = await createOrder();
      
      // Process M-Pesa payment
      const response = await apiRequest("POST", "/api/mpesa-payment", {
        phoneNumber: formData.phoneNumber,
        amount: total,
        orderId: order.id
      });
      
      const result = await response.json();
      
      if (result.success) {
        showToast("Payment successful! Check your phone for M-Pesa confirmation.", "success");
        clearCart();
        onSuccess();
        onClose();
      } else {
        showToast("Payment failed. Please try again.", "error");
      }
    } catch (error: any) {
      showToast(error.message || "Payment failed. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
      showToast("Please fill in all card details", "error");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create order first
      const order = await createOrder();
      
      // Create payment intent
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        amount: total,
        orderId: order.id
      });
      
      const { clientSecret } = await response.json();
      
      // In a real implementation, you would use Stripe Elements here
      // For now, we'll simulate a successful payment
      showToast("Card payment feature coming soon! Please use M-Pesa for now.", "info");
      
    } catch (error: any) {
      if (error.message.includes("Stripe not configured")) {
        showToast("Card payments are not configured. Please use M-Pesa.", "info");
      } else {
        showToast(error.message || "Payment failed. Please try again.", "error");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = () => {
    if (paymentMethod === "mpesa") {
      handleMpesaPayment();
    } else {
      handleCardPayment();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <GlassCard 
        variant="dark" 
        className="w-full max-w-md bg-white dark:bg-gray-900 backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Secure Payment
          </h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Order Summary */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Order Total:
            </span>
            <span className="text-2xl font-bold text-green-500">
              KSh {total}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {items.length} item(s)
          </p>
        </div>

        {/* Payment Method Tabs */}
        <div className="flex mb-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setPaymentMethod("mpesa")}
            className={`flex-1 py-3 px-4 font-semibold flex items-center justify-center transition-colors ${
              paymentMethod === "mpesa"
                ? "bg-green-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            M-Pesa
          </button>
          <button
            onClick={() => setPaymentMethod("card")}
            className={`flex-1 py-3 px-4 font-semibold flex items-center justify-center transition-colors ${
              paymentMethod === "card"
                ? "bg-green-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Card
          </button>
        </div>

        {/* Customer Information */}
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="customerName">Full Name *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleInputChange("customerName", e.target.value)}
              placeholder="Enter your full name"
              className="mt-1"
            />
          </div>
          
          {paymentMethod === "card" && (
            <>
              <div>
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                  placeholder="your.email@example.com"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                  placeholder="0712345678"
                  className="mt-1"
                />
              </div>
            </>
          )}
        </div>

        {/* Payment Forms */}
        {paymentMethod === "mpesa" && (
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="phoneNumber">M-Pesa Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder="0712345678"
                className="mt-1"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You will receive an M-Pesa prompt on your phone to complete the payment.
            </p>
          </div>
        )}

        {paymentMethod === "card" && (
          <div className="space-y-4 mb-6">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  placeholder="MM/YY"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange("cvv", e.target.value)}
                  placeholder="123"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                placeholder="John Doe"
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit}
          disabled={isProcessing}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 shadow-lg hover:shadow-green-500/25 transition-all duration-300"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay KSh ${total} with ${paymentMethod === "mpesa" ? "M-Pesa" : "Card"}`
          )}
        </Button>
      </GlassCard>
    </div>
  );
}
