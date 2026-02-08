
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { Question } from '@/types';

interface NotesDialogProps {
  open: boolean;
  onClose: () => void;
  question: Question;
  onSave: (id: string, notes: string) => void;
}

const NotesDialog = ({ open, onClose, question, onSave }: NotesDialogProps) => {
  const [notes, setNotes] = useState(question.notes || '');

  useEffect(() => {
    setNotes(question.notes || '');
  }, [question]);

  const handleSave = () => {
    onSave(question.id, notes);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display">Notes</DialogTitle>
          <DialogDescription>
            Add personal notes for <span className="font-medium text-foreground">{question.title}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Write your thoughts, approach, or complexity analysis here..."
            className="min-h-[200px] resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Notes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotesDialog;
