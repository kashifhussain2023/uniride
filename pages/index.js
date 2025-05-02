function Index() {
  return (
    <div>
      <h1>Home Page</h1>
      {/* Your content for the home page */}
    </div>
  );
}
export async function getServerSideProps() {
  // Check if the user is authenticated, e.g., by checking a session or token

  // If the user is not authenticated, redirect to the login page
  return {
    redirect: {
      destination: '/login',
      permanent: false, // Set to true if the redirection is not temporary
    },
  };
}
export default Index;
