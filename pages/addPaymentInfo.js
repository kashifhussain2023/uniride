import CheckoutForm from '@/components/presentation/CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { getSession } from 'next-auth/react';
const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);
const AddPaymentForm = ({ userAuth }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm userAuth={userAuth} />
    </Elements>
  );
};
export default AddPaymentForm;
export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
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
