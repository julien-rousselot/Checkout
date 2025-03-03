import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { paymentMethodId } = req.body;
    
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 2000,
        currency: "eur",
        payment_method: paymentMethodId,
        confirm: true,
        automatic_payment_methods: {
          enabled: true, // Active uniquement les paiements automatiques
          allow_redirects: "never", // Empêche les redirections
        },
      });

      if (paymentIntent.status === "succeeded") {
        res.status(200).json({ message: "Payment successful" });
      } else {
        res.status(400).json({ message: "Payment failed" });
      }
    } catch (error: any) {
      console.error("Erreur Stripe:", error);
      res.status(500).json({ message: error.message || "Erreur interne du serveur" });
   }
      
  } else {
    res.status(405).json({ message: "Méthode non autorisée" });
  }
}

