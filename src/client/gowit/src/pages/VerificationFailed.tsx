import { X } from "lucide-react";

export default function VerificationFailed() {
  return (
    <div className="bg-[#050608] min-h-screen px-3 pt-16 pb-16 flex items-center justify-center">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md w-full text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20">
          <span className="text-2xl text-red-400">
            <X />
          </span>
        </div>

        <h1 className="text-white text-2xl font-bold mb-2">
          Verification Failed
        </h1>

        <p className="text-gray-400 text-sm mb-6">
          Your verification link has expired. <br /> Click the button below to
          resend a new verification link.
        </p>

        <button className="w-full rounded-xl bg-[#E8630A] hover:bg-[#ff7a1a] text-white font-semibold py-3 transition">
          Resend Verification Link
        </button>
      </div>
    </div>
  );
}
