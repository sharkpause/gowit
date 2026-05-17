import { Check } from "lucide-react";
import { Link } from "react-router";

export default function VerificationSuccess() {
  return (
    <div className="bg-[#050608] min-h-screen px-3 pt-16 pb-16 flex items-center justify-center">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md w-full text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20">
          <span className="text-2xl text-green-400">
            <Check />
          </span>
        </div>

        <h1 className="text-white text-2xl font-bold mb-2">
          Verification Successful
        </h1>

        <p className="text-gray-400 text-sm mb-6">
          Your account has been successfully verified.
        </p>

        <Link
          to={"/login"}
          className="flex flex-1 justify-center items-center rounded-xl bg-[#E8630A] hover:bg-[#ff7a1a] text-white font-semibold py-3 px-3 transition"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}
