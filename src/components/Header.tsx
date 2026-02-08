import { Share2, Home, ChevronRight, Menu, Moon, Sun, User, Check, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { toast } from "sonner";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';

interface HeaderProps {
  totalQuestions: number;
  completedQuestions: number;
  isFollowing: boolean;
  onAddTopic: () => void;
  onToggleFollow: () => void;
  onOpenProfile: () => void;
  onCollapseAll: () => void;
  onRandomQuestion: () => void;
}

const Header = ({ 
  totalQuestions, 
  completedQuestions, 
  isFollowing,
  onAddTopic, 
  onToggleFollow,
  onOpenProfile,
  onCollapseAll,
  onRandomQuestion
}: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Calculate progress percentage
  const progress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleShare = async () => {
    const shareData = {
      title: 'Question Sheet',
      text: 'Check out this awesome question sheet!',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="flex flex-col border-b bg-background">
      {/* Top Navigation Bar */}
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-muted-foreground" />
          </Button>
          
          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
            <Link to="/nopage" className="flex items-center gap-2 hover:text-foreground">
              <Home className="h-4 w-4" />
              <ChevronRight className="h-4 w-4" />
              <span>Sheet</span>
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/nopage" className="font-medium text-foreground hover:underline">
              Question Sheet
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full"
            onClick={onOpenProfile}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 sm:px-6">
        <div className="flex flex-col-reverse justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex-1 space-y-4">
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Question Sheet
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              A comprehensive list of essential questions to help you prepare for technical interviews. 
              Track your progress and master data structures and algorithms.
            </p>
            
            <div className="flex items-center gap-3 pt-2">
              <Button variant="outline" size="sm" className="gap-2">
                 Popular
              </Button>
              <Button 
                variant={isFollowing ? "outline" : "secondary"} 
                size="sm" 
                className={`gap-2 ${!isFollowing ? "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400" : ""}`}
                onClick={onToggleFollow}
              >
                 {isFollowing ? (
                   <>
                     <Check className="h-4 w-4" />
                     Following
                   </>
                 ) : (
                   "Follow"
                 )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-6 sm:flex-col sm:items-end">
             <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                    Share
                 </Button>
                 <Button variant="outline" size="sm" onClick={onCollapseAll}>
                   Collapse All
                 </Button>
                 <Button onClick={onAddTopic} size="sm">
                   Add Topic
                 </Button>
                 <Button variant="outline" size="sm" className="gap-2" onClick={onRandomQuestion}>
                   <Shuffle className="h-4 w-4" />
                   Random
                 </Button>
             </div>

             <div className="relative flex h-32 w-32 items-center justify-center">
                {/* Background Circle */}
                <svg className="h-full w-full -rotate-90 transform">
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-muted/20"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="text-primary transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold">{completedQuestions}</span>
                  <span className="text-xs font-medium text-muted-foreground">/ {totalQuestions}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
};

export default Header;

