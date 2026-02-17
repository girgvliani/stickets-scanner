import type { FC } from "react";
import Spinner from "./spinner";

const Loading: FC = () => {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Spinner className="h-8 w-8 text-primary" />
    </div>
  );
};

export default Loading;
