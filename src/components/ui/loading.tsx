import { Loader2 } from "lucide-react";
import type { FC } from "react";

const Loading: FC = () => {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default Loading;
