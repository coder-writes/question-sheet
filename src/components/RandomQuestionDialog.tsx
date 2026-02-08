import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { Question } from "@/types";

interface RandomQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: Question | null;
}

const RandomQuestionDialog = ({ open, onOpenChange, question }: RandomQuestionDialogProps) => {
  if (!question) return null;

  const difficultyColor = {
    Easy: "bg-green-500 hover:bg-green-600",
    Medium: "bg-yellow-500 hover:bg-yellow-600",
    Hard: "bg-red-500 hover:bg-red-600",
  }[question.difficulty] || "bg-gray-500";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Random Question Pick</DialogTitle>
          <DialogDescription>
            Challenge yourself with this random question!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <Badge className={`${difficultyColor} text-white`}>
            {question.difficulty}
          </Badge>
          <h3 className="text-xl font-semibold text-center">{question.title}</h3>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
            type="button"
            className="w-full sm:w-auto gap-2"
            onClick={() => {
              if (question.link) {
                window.open(question.link, '_blank');
              }
              onOpenChange(false);
            }}
          >
            Solve Problem
            <ExternalLink className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RandomQuestionDialog;
