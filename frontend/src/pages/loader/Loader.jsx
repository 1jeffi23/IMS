import { Loader2 } from "lucide-react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <Loader2
          className="h-20 w-20 animate-spin text-emerald-600"
        />

        {text && (
          <span className="text-base text-gray-500">
            {text}
          </span>
        )}
      </div>
    </div>
  );
};

export default Loader;