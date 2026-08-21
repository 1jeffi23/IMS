import { AlertTriangle } from "lucide-react";

const ErrorState = ({
  title = "Something went wrong",
  message = "Something went wrong while loading data.",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border border-red-200 rounded-2xl p-8 text-center max-w-md w-full mx-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle
            size={30}
            className="text-red-500"
          />
        </div>

        <h2 className="mt-4 font-semibold text-gray-800">
          {title}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {message}
        </p>
      </div>
    </div>
  );
};

export default ErrorState;