export default function Home() {
  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        3D Print Queue Management
      </h1>
      <p className="text-gray-600">
        Please{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          login
        </a>{" "}
        or{" "}
        <a href="/register" className="text-blue-500 hover:underline">
          register
        </a>{" "}
        to continue.
      </p>
    </div>
  );
}
