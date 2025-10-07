// components/LoadingSpinner.tsx
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

  // Используем fixed позиционирование для полного контроля
  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center flex-col z-50 bg-gray-100"
    : "w-full min-h-[60vh] flex items-center justify-center flex-col";

  return (
    <div className={containerClasses}>
      <div
        className={`animate-spin rounded-full border-b-2 border-cyan-700 ${sizeClasses[size]}`}
      ></div>
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
}
