import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products: " + error.message });
    }
  });

  // Get products by category
  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products: " + error.message });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: "Error creating order: " + error.message });
    }
  });

  // Create payment intent for Stripe
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ 
        message: "Stripe not configured. Please provide STRIPE_SECRET_KEY environment variable." 
      });
    }

    try {
      const { amount, orderId } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert KSh to cents
        currency: "kes", // Kenya Shillings
        metadata: {
          orderId: orderId?.toString() || "",
        },
      });

      // Update order with payment intent ID if orderId provided
      if (orderId) {
        await storage.updateOrderPaymentIntent(orderId, paymentIntent.id);
      }

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // M-Pesa simulation endpoint (placeholder for real M-Pesa integration)
  app.post("/api/mpesa-payment", async (req, res) => {
    try {
      const { phoneNumber, amount, orderId } = req.body;
      
      if (!phoneNumber || !amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid phone number or amount" });
      }

      // In a real implementation, this would integrate with M-Pesa API
      // For now, we'll simulate a successful payment
      const transactionId = `MP${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      // Update order status
      if (orderId) {
        await storage.updateOrderStatus(orderId, "paid");
      }

      res.json({ 
        success: true, 
        transactionId,
        message: "Payment successful. You will receive an M-Pesa confirmation SMS shortly."
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Error processing M-Pesa payment: " + error.message 
      });
    }
  });

  // Webhook for Stripe payment confirmations
  app.post("/api/stripe-webhook", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: "Stripe not configured" });
    }

    try {
      const event = req.body;

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          const orderId = paymentIntent.metadata.orderId;
          
          if (orderId) {
            await storage.updateOrderStatus(parseInt(orderId), "paid");
          }
          break;
        
        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object;
          const failedOrderId = failedPayment.metadata.orderId;
          
          if (failedOrderId) {
            await storage.updateOrderStatus(parseInt(failedOrderId), "failed");
          }
          break;
      }

      res.json({ received: true });
    } catch (error: any) {
      res.status(400).json({ message: "Webhook error: " + error.message });
    }
  });

  // Get order status
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching order: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
