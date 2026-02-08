import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { DragConfirmDialogState } from '@/types';

interface DragConfirmDialogProps {
  state: DragConfirmDialogState;
}

export const DragConfirmDialog = ({ state }: DragConfirmDialogProps) => {
  if (!state) return null;

  const { type, sourceName, destinationName, onConfirm, onCancel, isOpen } = state;
  const itemType = type === 'question' ? 'Question' : 'Sub-topic';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move or Copy {itemType}?</DialogTitle>
          <DialogDescription>
            You are dragging "{sourceName}" to "{destinationName}". Would you like to move it there or
            create a copy?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm('move')}>Move</Button>
          <Button onClick={() => onConfirm('copy')}>Copy</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

