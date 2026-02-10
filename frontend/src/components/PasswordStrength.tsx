interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (
    pass: string,
  ): { score: number; label: string; color: string } => {
    if (pass.length === 0) return { score: 0, label: "", color: "" };
    if (pass.length < 6)
      return { score: 1, label: "Weak", color: "bg-red-500" };
    if (pass.length < 10)
      return { score: 2, label: "Fair", color: "bg-yellow-500" };
    if (pass.length < 14)
      return { score: 3, label: "Good", color: "bg-blue-500" };
    return { score: 4, label: "Strong", color: "bg-green-500" };
  };

  const strength = getStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 w-1/4 rounded ${
              level <= strength.score ? strength.color : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p
        className={`text-xs mt-1 ${strength.score < 3 ? "text-red-600" : "text-green-600"}`}
      >
        Password strength: {strength.label}
      </p>
    </div>
  );
}
