import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/components/features/Toast";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Loader2 } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
if (!stripePublicKey) {
  console.warn('Missing VITE_STRIPE_PUBLIC_KEY environment variable');
}
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { showToast } = useToast();
  const { clearCart } = useCart();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (error) {
      showToast(error.message || "Payment failed", "error");
    } else {
      showToast("Payment successful! Thank you for your purchase!", "success");
      clearCart();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 shadow-lg hover:shadow-green-500/25 transition-all duration-300"
      >
        Complete Payment
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const { total, items } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    if (total <= 0) {
      showToast("Your cart is empty", "error");
      return;
    }

    // Create PaymentIntent as soon as the page loads
    apiRequest("POST", "/api/create-payment-intent", { 
      amount: total,
      items: items.map(item => ({ id: item.id, quantity: item.quantity }))
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        showToast(error.message || "Failed to initialize payment", "error");
      });
  }, [total, items, showToast]);

  if (!stripePromise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-950">
        <GlassCard className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Not Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Card payments are not configured. Please use M-Pesa on the main page.
          </p>
        </GlassCard>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-950">
        <GlassCard className="text-center p-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-500" />
          <p className="text-gray-600 dark:text-gray-400">Setting up payment...</p>
        </GlassCard>
      </div>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-green-950 py-20">
      <div className="container mx-auto px-4 max-w-md">
        <GlassCard>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Complete Your Payment
          </h1>
          
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900 dark:text-white">Total:</span>
              <span className="text-xl font-bold text-green-500">KSh {total}</span>
            </div>
          </div>
          
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        </GlassCard>
      </div>
    </div>
  );
};
