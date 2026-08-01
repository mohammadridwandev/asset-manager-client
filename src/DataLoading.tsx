type DataLoadingProps = {
  title?: string;
  message?: string;
  fullScreen?: boolean;
};

export default function DataLoading({
  title = "Loading Data",
  message = "Please wait while we prepare your information.",
  fullScreen = false,
}: DataLoadingProps) {
  return (

    <div
      className={`flex  items-center justify-center px-4 ${
        fullScreen
          ? "fixed inset-0 z-50 bg-app-bg/90 backdrop-blur-sm"
          : "min-h-75 w-full"
      }`}
    >
      <div className="flex w-full  flex-col items-center rounded-2xl  bg-app-bg p-8 text-center ">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-app-brand/15" />

          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-app-brand border-r-app-brand" />

          <div className="h-7 w-7 rounded-full bg-app-brand/10" />
        </div>

        <h2 className="mt-5 text-lg font-bold text-app-text">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-app-gray">
          {message}
        </p>

        <div className="mt-5 flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-app-brand [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-app-brand [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-app-brand" />
        </div>
      </div>
    </div>
  );
}