import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import notFoundImage from "@/assets/image.png";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="mb-2 font-display text-4xl font-bold text-orange-500 sm:text-5xl">
        Oops...
      </h1>
      <h2 className="mb-4 font-display text-8xl font-black text-foreground sm:text-9xl">
        404
      </h2>
      <h3 className="mb-2 text-2xl font-bold text-muted-foreground sm:text-3xl">
        Page Not Found
      </h3>
      <p className="mb-8 max-w-md text-muted-foreground">
        The page you are looking for is either missing or temporarily Unavailable
      </p>
      
      <Link to="/">
        <Button 
          size="lg"
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          Go to Homepage
        </Button>
      </Link>

      <div className="mt-12">
        <img 
          src={notFoundImage} 
          alt="404 Owl" 
          className="mx-auto max-w-[280px] sm:max-w-md"
        />
      </div>
    </div>
  );
};

export default NotFound;
