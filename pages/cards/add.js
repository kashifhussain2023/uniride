import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { AddCardForm } from '@/utils/dynamicImports';
import { parseCookies } from 'nookies';

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
  try {
    const cookies = parseCookies(context);
    const newUserRegistration = cookies?.newUserRegistration;
    if (!newUserRegistration) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    const userAuthData = JSON.parse(newUserRegistration);
    if (!userAuthData || Object.keys(userAuthData).length === 0) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    return {
      props: {
        userAuth: userAuthData,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}
