import { useState } from "react";
import { ShieldCheck, ArrowRight, Lock } from "lucide-react";

export default function MasterPinAuth({ onAuthenticated }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Get master PIN from env or stored custom master PIN (no hardcoding in source)
  const configuredPin = import.meta.env.VITE_MASTER_PIN || localStorage.getItem("ambba_custom_master_pin");

  const verifyPin = (candidate) => {
    // If no pin has ever been configured, the first entered 4-digit PIN becomes your master PIN!
    if (!configuredPin) {
      if (candidate.length < 4) {
        setError(true);
        setErrorMessage("Please choose at least a 4-digit Master PIN.");
        setTimeout(() => setError(false), 2000);
        return;
      }
      localStorage.setItem("ambba_custom_master_pin", candidate);
      sessionStorage.setItem("ambba_master_session", "authenticated");
      sessionStorage.setItem("ambba_active_pin", candidate);
      onAuthenticated();
      return;
    }

    if (candidate.trim() === configuredPin.trim()) {
      sessionStorage.setItem("ambba_master_session", "authenticated");
      sessionStorage.setItem("ambba_active_pin", candidate.trim());
      onAuthenticated();
    } else {
      setError(true);
      setErrorMessage("Incorrect Master PIN.");
      setPin("");
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    verifyPin(pin);
  };

  const handleKeypad = (num) => {
    if (pin.length < 8) {
      const next = pin + num;
      setPin(next);
      if (configuredPin && next === configuredPin) {
        verifyPin(next);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background ambient glows */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />

      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl text-center">
        {/* Brand Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
          <ShieldCheck size={32} />
        </div>

        <h1 className="text-xl font-black tracking-tight text-white">AmbbaTech Control</h1>
        <p className="mt-1 text-xs text-slate-400">
          {!configuredPin ? "Set your private Master PIN" : "Enter your Master PIN to unlock"}
        </p>

        {/* PIN Dots */}
        <div className="my-6 flex justify-center gap-3">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`h-3.5 w-3.5 rounded-full transition-all duration-200 ${
                pin.length > idx
                  ? error
                    ? "bg-rose-500 scale-125"
                    : "bg-blue-500 scale-125 shadow-sm shadow-blue-400"
                  : "bg-slate-700/60 ring-1 ring-white/10"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="mb-4 text-xs font-bold text-rose-400 animate-bounce">
            {errorMessage || "Incorrect Master PIN."}
          </p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeypad(String(num))}
              className="h-13 rounded-2xl border border-white/5 bg-white/5 text-lg font-bold text-white hover:bg-white/15 active:scale-95 transition cursor-pointer"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPin("")}
            className="h-13 rounded-2xl border border-white/5 bg-white/5 text-xs font-bold text-slate-400 hover:bg-white/10 transition cursor-pointer"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleKeypad("0")}
            className="h-13 rounded-2xl border border-white/5 bg-white/5 text-lg font-bold text-white hover:bg-white/15 active:scale-95 transition cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-13 rounded-2xl border border-white/5 bg-white/5 text-xs font-bold text-slate-400 hover:bg-white/10 transition cursor-pointer"
          >
            ⌫
          </button>
        </div>

        {/* Keyboard input form */}
        <form onSubmit={handleSubmit} className="mt-6 flex items-center gap-2">
          <input
            type="password"
            placeholder="Or type PIN..."
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-center text-xs font-bold text-white tracking-widest outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition cursor-pointer"
          >
            <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
