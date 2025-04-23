import React from "react";
import { getSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/presentation/CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const AddPaymentForm = ({ userAuth }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm userAuth={userAuth} />
    </Elements>
  );
};

export default AddPaymentForm;

export async function getServerSideProps(context) {
  // You can access the session and user information here.
  const session = await getSession(context);

  if (!session) {
    // Handle unauthenticated access
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userAuth: session.user || null,
    },
  };
}
