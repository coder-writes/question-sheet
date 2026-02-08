
import { X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  // Close sidebar when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-all duration-100 ease-in-out"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 h-full w-64 border-r bg-background shadow-lg transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-14 items-center justify-between border-b px-4">
          <span className="font-semibold text-lg">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="py-4">
          <nav className="flex flex-col gap-1 px-2">
            <Link to="/unique-ideas">
              <Button 
                variant={location.pathname === '/unique-ideas' ? "secondary" : "ghost"} 
                className="w-full justify-start gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                Unique Ideas
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
