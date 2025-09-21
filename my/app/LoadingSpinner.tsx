interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = "medium",
  text = "Загрузка...",
  fullScreen = true,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-12 w-12",
    large: "h-16 w-16",
  };

  const containerClasses = fullScreen
    ? "min-h-screen bg-gray-100 flex items-center justify-center flex-col"
    : "flex items-center justify-center flex-col p-4";

  return (
    <div className={containerClasses}>
      <div
        className={`animate-spin rounded-full border-b-2 border-cyan-700 ${sizeClasses[size]}`}
      ></div>
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
}
