import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { AddCardForm } from '@/utils/dynamicImports';

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

const AddPaymentForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <AddCardForm />
    </Elements>
  );
};
export default AddPaymentForm;
