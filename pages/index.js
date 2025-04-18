import { useRouter } from 'next/router';

function Index() {
  return (
    <div>
      <h1>Home Page</h1>
      {/* Your content for the home page */}
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  // Check if the user is authenticated, e.g., by checking a session or token
  const isAuthenticated = /* Perform your authentication check here */ false;

    // If the user is not authenticated, redirect to the login page
    return {
      redirect: {
        destination: '/login',
        permanent: false, // Set to true if the redirection is not temporary
      },
    };
  }


export default Index;
