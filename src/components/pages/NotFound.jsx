import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-6">
            <ApperIcon name="Search" className="w-16 h-16 text-primary-500" />
          </div>
          
          <div className="text-6xl font-bold gradient-text mb-2">404</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h1>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. 
          The page may have been moved, deleted, or doesn't exist.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleGoHome}
            variant="primary"
            size="lg"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            Go to Homepage
          </Button>
          
          <Button
            onClick={handleGoBack}
            variant="secondary"
            size="lg"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Popular Pages</h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button
              onClick={() => navigate("/")}
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              Feedback Boards
            </button>
            <button
              onClick={() => navigate("/admin/boards")}
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              Manage Boards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;