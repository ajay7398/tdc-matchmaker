
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { loginUser } from "../services/auth.service.js";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submit
    setLoading(true);

    try {
      const { data } = await loginUser(email, password);
      setUser(data.user);         // Save user to global context
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}! 💝`);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Quick fill for demo credentials
  const fillDemo = (email, pass) => {
    setEmail(email);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo / Brand header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-2xl mb-4 shadow-sm">
            <Heart className="text-rose-500 fill-rose-500" size={30} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            The Date Crew
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-sans">
            Matchmaker Portal — Internal Tool
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-rose-50 p-8">
          <h2 className="font-serif text-xl font-semibold text-gray-800 mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@thedatecrew.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm font-sans focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all"
                />
                {/* Show/hide password toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-rose-50 rounded-2xl">
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-3">
              Demo Credentials
            </p>
            <div className="space-y-2">
              {[
                { name: "Priya Sharma", email: "priya@thedatecrew.com", role: "Senior Matchmaker" },
                { name: "Arjun Mehta", email: "arjun@thedatecrew.com", role: "Matchmaker" },
              ].map((cred) => (
                <button
                  key={cred.email}
                  onClick={() => fillDemo(cred.email, "matchmaker123")}
                  className="w-full text-left p-2.5 bg-white rounded-xl border border-rose-100 hover:border-rose-300 transition-colors"
                >
                  <p className="text-xs font-semibold text-gray-700">{cred.name}</p>
                  <p className="text-xs text-gray-400">{cred.email} • matchmaker123</p>
                  <span className="text-xs text-rose-400">{cred.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

  
      </div>
    </div>
  );
};

export default LoginPage;
