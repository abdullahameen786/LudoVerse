// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

function Register() {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);
      const userCredential = await register(formData.name, formData.email, formData.password);
      
      const targetUser = userCredential?.user || userCredential;
      if (targetUser?.uid) {
        await setDoc(doc(db, "users", targetUser.uid), {
          uid: targetUser.uid,
          name: formData.name || targetUser.displayName || "Player",
          coins: 1000, 
          matchesPlayed: 0,
          matchesWon: 0,
          createdAt: new Date().toISOString()
        });
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    try {
      const userCredential = await googleLogin();
      
      const targetUser = userCredential?.user || userCredential;
      if (targetUser?.uid) {
        await setDoc(doc(db, "users", targetUser.uid), {
          uid: targetUser.uid,
          name: targetUser.displayName || targetUser.email.split("@")[0] || "Player",
          coins: 1000,
          matchesPlayed: 0,
          matchesWon: 0,
          createdAt: new Date().toISOString()
        }, { merge: true }); 
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Google registration failed.");
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-76px)] items-center justify-center px-4 sm:px-6 bg-slate-50 relative overflow-hidden py-8">
      
      {/* 🔮 Background Ambient Glows */}
      <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-indigo-400/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-96 h-96 bg-violet-400/20 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Main Registration Card */}
      <div className="w-full max-w-md rounded-[2rem] bg-white/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-indigo-100/50 border border-white relative z-10 animate-fade-in">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-4 transform -rotate-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Create Account
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1.5">
            Join the arena and claim your starting bonus
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 rounded-xl bg-rose-50 p-4 flex items-start gap-3 border border-rose-100 animate-shake">
            <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-rose-600">{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-50/50 border border-slate-200 p-3.5 text-slate-800 font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl bg-slate-50/50 border border-slate-200 p-3.5 text-slate-800 font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
              placeholder="you@example.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-50/50 border border-slate-200 p-3.5 text-slate-800 font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Confirm</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-50/50 border border-slate-200 p-3.5 text-slate-800 font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3.5 font-bold text-white hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 cursor-pointer shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-7 text-center">
          <hr className="border-slate-200" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Or</span>
        </div>

        {/* Google Authentication Button with SVG Logo */}
        <button
          onClick={handleGoogleSignup}
          className="w-full rounded-xl bg-white border border-slate-200 py-3.5 font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Footer Link */}
        <p className="mt-8 text-center text-sm font-medium text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 transition-all">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;