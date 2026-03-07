import { useState } from "react";
import { updateEmail } from "../services/profileService";

interface ChangeEmailProps {
  currentEmail: string;
  onClose: () => void;
  onSuccess: (email: string) => void;
}

const ChangeEmailModal = ({
  currentEmail,
  onClose,
  onSuccess,
}: ChangeEmailProps) => {
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateEmail(email, password);
      if (response.success) {
        onSuccess(email);
        onClose();
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      // Axios puts the response body in err.response.data
      const message = err?.response?.data?.message;
      setError(message ?? "Failed to update email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div
        className="bg-white rounded-xl w-full max-w-sm overflow-hidden"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
      >
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400" />
        <div className="p-5">
          <h3
            className="text-base font-black uppercase text-gray-900 mb-4"
            style={{ letterSpacing: "0.1em" }}
          >
            Change Email
          </h3>

          <div className="space-y-3">
            <div>
              <label
                className="block text-xs font-black uppercase text-gray-400 mb-1"
                style={{ letterSpacing: "0.08em" }}
              >
                New Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label
                className="block text-xs font-black uppercase text-gray-400 mb-1"
                style={{ letterSpacing: "0.08em" }}
              >
                Confirm Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-black uppercase border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
              style={{ letterSpacing: "0.08em" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg text-sm font-black uppercase text-white transition-all disabled:opacity-50"
              style={{ background: "#2563eb", letterSpacing: "0.08em" }}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeEmailModal;
