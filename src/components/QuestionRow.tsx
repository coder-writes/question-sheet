import { GripVertical, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Draggable } from '@hello-pangea/dnd';
import type { Question } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface QuestionRowProps {
  question: Question;
  index: number;
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
}

const difficultyColor: Record<string, string> = {
  Easy: 'bg-success/15 text-success border-success/20',
  Medium: 'bg-warning/15 text-warning border-warning/20',
  Hard: 'bg-destructive/15 text-destructive border-destructive/20',
};

const QuestionRow = ({ question, index, onEdit, onDelete }: QuestionRowProps) => {
  return (
    <Draggable draggableId={question.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all ${
            snapshot.isDragging
              ? 'border-primary/40 bg-accent shadow-lg'
              : 'border-transparent bg-card hover:border-border hover:bg-muted/40'
          }`}
        >
          <div
            {...provided.dragHandleProps}
            className="drag-handle flex-shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground"
          >
            <GripVertical className="h-4 w-4" />
          </div>

          <span className="min-w-[2ch] text-xs font-medium text-muted-foreground">
            {index + 1}.
          </span>

          <span className="flex-1 text-sm font-medium">{question.title}</span>

          <Badge
            variant="outline"
            className={`text-[11px] font-semibold ${difficultyColor[question.difficulty]}`}
          >
            {question.difficulty}
          </Badge>

          {question.link && (
            <a
              href={question.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-muted-foreground/50 transition-colors hover:text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit(question)}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => onDelete(question.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default QuestionRow;
