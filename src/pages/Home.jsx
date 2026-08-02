import useAuth from "../hooks/useAuth";

function Home() {
  const { user } = useAuth();

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">Home</h1>

      {user ? (
        <p className="mt-4 text-green-600">
          Welcome {user.displayName || user.email}
        </p>
      ) : (
        <p className="mt-4 text-red-600">
          Not Logged In
        </p>
      )}
    </div>
  );
}

export default Home;