// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-9xl font-extrabold text-indigo-600">404</h1>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Page not found
      </p>
      <p className="mt-2 text-slate-600">Sorry, we couldn’t find the page you’re looking for.</p>
      <div className="mt-6">
        <Link
          to="/"
          className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition"
        >
          Go back home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;