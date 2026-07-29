import { FiArrowLeft, FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import imgCover from "../../assets/image/bg-image-2.jpg"
import { Helmet } from "react-helmet-async";

export default function Not_Found() {
  const navigate = useNavigate();


  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-app-bg">
      {/* Left Side */}

      
  <Helmet>
    <title>Asset Manager | Not Found</title>
  </Helmet>
      
      <div className="flex items-center px-8 lg:px-20">
        <div className="max-w-lg">
          <span className="text-app-brand font-semibold">
            Error 404
          </span>

          <h1 className="mt-4 text-5xl lg:text-6xl font-bold text-app-text">
            Page not found
          </h1>

          <p className="mt-5 text-app-gray text-lg">
            Sorry, the page you are looking for doesn't exist or has
            been moved.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-md cursor-pointer border border-app-gray/20 px-5 py-2 text-sm font-medium hover:bg-app-secondary/10 transition-all"
            >
              <FiArrowLeft />
              Go Back
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 rounded-md cursor-pointer bg-app-brand px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-all"
            >
              <FiHome />
              Take me home
            </button>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:block relative">
        <img
          src={imgCover}
          alt="404"
          className="h-screen w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/20" />
      </div>
    </div>
  );
}