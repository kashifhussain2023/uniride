import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import AddCardForm from "@/components/presentation/AddCardForm";
import { parseCookies } from "nookies";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const AddPaymentForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <AddCardForm />
    </Elements>
  );
};

export default AddPaymentForm;

