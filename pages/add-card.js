import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import AddCardForm from "@/components/presentation/AddCardForm";
import { parseCookies } from "nookies";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const AddPaymentForm = ({ userAuth }) => {
  return (
    <Elements stripe={stripePromise}>
      <AddCardForm userAuth={userAuth} />
    </Elements>
  );
};

export default AddPaymentForm;

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const newUserRegistration = cookies?.newUserRegistration || false;
  const newUserRegistrationCookieParsed = JSON.parse(newUserRegistration);

  if (
    !newUserRegistrationCookieParsed &&
    Object.keys(newUserRegistrationCookieParsed).length === 0
  ) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userAuth: newUserRegistrationCookieParsed || null,
    },
  };
}
