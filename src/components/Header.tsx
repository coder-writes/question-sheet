import { BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  totalQuestions: number;
  totalTopics: number;
  onAddTopic: () => void;
}

const Header = ({ totalQuestions, totalTopics, onAddTopic }: HeaderProps) => {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
              Question Sheet
            </h1>
            <p className="text-sm text-muted-foreground">
              {totalTopics} topics · {totalQuestions} questions
            </p>
          </div>
        </div>
        <Button onClick={onAddTopic} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Topic</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
