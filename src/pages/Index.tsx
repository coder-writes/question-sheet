import { useCallback, useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable, type DropResult, type DragUpdate } from '@hello-pangea/dnd';
import { useQuestionStore } from '@/store/questionStore';
import type { Question } from '@/types';
import Header from '@/components/Header';
import TopicCard from '@/components/TopicCard';
import FormDialog from '@/components/FormDialog';
import { DragConfirmDialog } from '@/components/DragConfirmDialog';
import { ProfileDialog } from '@/components/ProfileDialog';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";
import RandomQuestionDialog from '@/components/RandomQuestionDialog';
import NotesDialog from '@/components/NotesDialog';

const Index = () => {
  const store = useQuestionStore();
  const dialog = store.dialog;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [randomDialogOpen, setRandomDialogOpen] = useState(false);
  const [randomQuestion, setRandomQuestion] = useState<Question | null>(null);

  useEffect(() => {
    if (store.questions.length === 0 && !store.isLoading && !store.error) {
      store.fetchData();
    }
  }, [store.questions.length, store.isLoading, store.error, store.fetchData]);

  const completedQuestions = store.questions.filter((q) => q.completed).length;

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination, type } = result;

      // Clear timeout on drag end
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index) return;

      // Handle drops on triggers
      let effectiveDestinationId = destination.droppableId;
      if (effectiveDestinationId.startsWith('trigger-')) {
        const parts = effectiveDestinationId.split('-');
        // trigger-{type}-{subtype}-{id}
        // type: topic/subtopic
        // subtype: q/st (question/subtopic)
        // id: rest
        const triggerType = parts[1]; // topic or subtopic
        const itemType = parts[2]; // q or st
        const id = parts.slice(3).join('-');

        if (triggerType === 'topic') {
          if (itemType === 'q') {
            effectiveDestinationId = `questions-${id}`; // Drop into topic's question list
          } else if (itemType === 'st') {
            effectiveDestinationId = `subTopics-${id}`; // Drop into topic's subtopic list
          }
        } else if (triggerType === 'subtopic') {
          // itemType is 'q'
          effectiveDestinationId = `questions-${id}`;
        }
      }

      if (type === 'topic') {
        store.reorderTopics(source.index, destination.index);
      } else if (type === 'subTopic') {
        const sourceTopicId = source.droppableId.replace('subTopics-', '');
        const isTriggerDrop = effectiveDestinationId.startsWith('subTopics-');
        const destTopicId = isTriggerDrop 
          ? effectiveDestinationId.replace('subTopics-', '') 
          : destination.droppableId.replace('subTopics-', '');

        if (sourceTopicId !== destTopicId) {
          const subTopic = store.subTopics.find((st) => st.id === result.draggableId);
          const destTopic = store.topics.find((t) => t.id === destTopicId);

          if (subTopic && destTopic) {
            store.setDragConfirmDialog({
              isOpen: true,
              type: 'subTopic',
              sourceId: subTopic.id,
              sourceName: subTopic.name,
              destinationName: destTopic.name,
              onConfirm: (action) => {
                if (action === 'move') {
                  store.moveSubTopic(subTopic.id, destTopic.id, 0); // Add to top if dropped on trigger/different list
                } else {
                  store.copySubTopic(subTopic.id, destTopic.id, 0);
                }
                store.setDragConfirmDialog(null);
              },
              onCancel: () => store.setDragConfirmDialog(null),
            });
          }
          return;
        }

        store.reorderSubTopics(sourceTopicId, source.index, destination.index);
      } else if (type === 'question') {
        const sourceParentId = source.droppableId.replace('questions-', '');
        const destParentId = effectiveDestinationId.replace('questions-', '');

        if (sourceParentId !== destParentId) {
          const question = store.questions.find((q) => q.id === result.draggableId);
          
          // Destination could be a topic or subtopic
          const destSubTopic = store.subTopics.find((st) => st.id === destParentId);
          const destTopic = store.topics.find((t) => t.id === destParentId);

          if (question && (destSubTopic || destTopic)) {
            const destName = destSubTopic?.name || destTopic?.name || 'Unknown';
            const newTopicId = destSubTopic ? destSubTopic.topicId : destTopic!.id;
            const newSubTopicId = destSubTopic ? destSubTopic.id : undefined;

            store.setDragConfirmDialog({
              isOpen: true,
              type: 'question',
              sourceId: question.id,
              sourceName: question.title,
              destinationName: destName,
              onConfirm: (action) => {
                if (action === 'move') {
                  store.moveQuestion(question.id, newTopicId, newSubTopicId, 0); // Add to top
                } else {
                  store.copyQuestion(question.id, newTopicId, newSubTopicId, 0);
                }
                store.setDragConfirmDialog(null);
              },
              onCancel: () => store.setDragConfirmDialog(null),
            });
          }
          return;
        }

        store.reorderQuestions(sourceParentId, source.index, destination.index);
      }
    },
    [store]
  );

  const handleDragUpdate = useCallback(
    (update: DragUpdate) => {
      const { destination } = update;
      if (!destination) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        return;
      }

      if (destination.droppableId.startsWith('trigger-')) {
        if (!timeoutRef.current) {
          timeoutRef.current = setTimeout(() => {
            const parts = destination.droppableId.split('-');
            // ID formats: trigger-topic-q-{id}, trigger-topic-st-{id}, trigger-subtopic-q-{id}
            const type = parts[1]; // 'topic' or 'subtopic'
            // id is the rest of the string joined (in case id contains hyphens)
            const id = parts.slice(3).join('-');

            if (type === 'topic') {
              if (!store.expandedTopics[id]) {
                store.toggleTopicExpansion(id);
              }
            } else if (type === 'subtopic') {
              if (!store.expandedSubTopics[id]) {
                store.toggleSubTopicExpansion(id);
              }
            }
            timeoutRef.current = null;
          }, 300); // 300ms delay
        }
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    },
    [store]
  );



  const handleRandomQuestion = useCallback(() => {
    const allQuestions = store.questions;
    if (allQuestions.length === 0) {
      toast.error("No questions available to pick from!");
      return;
    }
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    setRandomQuestion(allQuestions[randomIndex]);
    setRandomDialogOpen(true);
  }, [store.questions]);

  const handleDialogSubmit = useCallback(
    (values: Record<string, string>) => {
      if (!dialog) return;
      switch (dialog.type) {
        case 'addTopic':
          store.addTopic(values.name);
          break;
        case 'editTopic':
          store.editTopic(dialog.topic.id, values.name);
          break;
        case 'addSubTopic':
          store.addSubTopic(dialog.topicId, values.name);
          break;
        case 'editSubTopic':
          store.editSubTopic(dialog.subTopic.id, values.name);
          break;
        case 'addQuestion':
          store.addQuestion({
            title: values.title,
            difficulty: values.difficulty as Question['difficulty'],
            topic: dialog.topicId,
            subTopic: dialog.subTopicId,
            link: values.link || undefined,
          });
          break;
        case 'editQuestion':
          store.editQuestion(dialog.question.id, {
            title: values.title,
            difficulty: values.difficulty as Question['difficulty'],
            link: values.link || undefined,
          });
          break;
      }
      store.setDialog(null);
    },
    [dialog, store]
  );
  
  const handleSaveNotes = useCallback((id: string, notes: string) => {
    store.editQuestion(id, { notes });
  }, [store]);

  const dialogConfig = (() => {
    if (!dialog) return null;
    switch (dialog.type) {
      case 'addTopic':
        return {
          title: 'Add Topic',
          fields: [{ name: 'name', label: 'Topic Name', placeholder: 'e.g. Dynamic Programming' }],
        };
      case 'editTopic':
        return {
          title: 'Edit Topic',
          fields: [
            { name: 'name', label: 'Topic Name', defaultValue: dialog.topic.name },
          ],
        };
      case 'addSubTopic':
        return {
          title: 'Add Sub-topic',
          fields: [{ name: 'name', label: 'Sub-topic Name', placeholder: 'e.g. Sliding Window' }],
        };
      case 'editSubTopic':
        return {
          title: 'Edit Sub-topic',
          fields: [
            { name: 'name', label: 'Sub-topic Name', defaultValue: dialog.subTopic.name },
          ],
        };
      case 'addQuestion':
        return {
          title: 'Add Question',
          fields: [
            { name: 'title', label: 'Question Title', placeholder: 'e.g. Two Sum' },
            {
              name: 'difficulty',
              label: 'Difficulty',
              type: 'select' as const,
              options: [
                { label: 'Easy', value: 'Easy' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Hard', value: 'Hard' },
              ],
              defaultValue: 'Medium',
            },
            { name: 'link', label: 'Link (optional)', placeholder: 'https://leetcode.com/...' },
          ],
        };
      case 'editQuestion':
        return {
          title: 'Edit Question',
          fields: [
            { name: 'title', label: 'Question Title', defaultValue: dialog.question.title },
            {
              name: 'difficulty',
              label: 'Difficulty',
              type: 'select' as const,
              options: [
                { label: 'Easy', value: 'Easy' },
                { label: 'Medium', value: 'Medium' },
                { label: 'Hard', value: 'Hard' },
              ],
              defaultValue: dialog.question.difficulty,
            },
            { name: 'link', label: 'Link (optional)', defaultValue: dialog.question.link || '' },
          ],
        };
    }
  })();

  if (store.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (store.error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4 text-center">
        <p className="text-lg font-medium text-destructive">Failed to load data</p>
        <p className="text-sm text-muted-foreground">{store.error}</p>
        <button
          onClick={() => store.fetchData()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        totalQuestions={store.questions.length}
        completedQuestions={completedQuestions}
        isFollowing={store.isFollowing}
        onAddTopic={() => store.setDialog({ type: 'addTopic' })}
        onToggleFollow={store.toggleFollowing}
        onOpenProfile={() => store.setProfileOpen(true)}
        onCollapseAll={store.collapseAll}
        onRandomQuestion={handleRandomQuestion}
      />

      <main className="container mx-auto px-4 py-6 sm:px-6">
        <DragDropContext onDragEnd={handleDragEnd} onDragUpdate={handleDragUpdate}>
          <Droppable droppableId="topics" type="topic">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-3"
              >
                {store.topics.map((topic, i) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    index={i}
                    subTopics={store.subTopics.filter((st) => st.topicId === topic.id)}
                    questions={store.questions}
                    onEditTopic={(t) => store.setDialog({ type: 'editTopic', topic: t })}
                    onDeleteTopic={(id) => store.deleteTopic(id)}
                    onAddSubTopic={(topicId) => store.setDialog({ type: 'addSubTopic', topicId })}
                    onEditSubTopic={(st) => store.setDialog({ type: 'editSubTopic', subTopic: st })}
                    onDeleteSubTopic={(id) => store.deleteSubTopic(id)}
                    onAddQuestion={(topicId, subTopicId) =>
                      store.setDialog({ type: 'addQuestion', topicId, subTopicId })
                    }
                    onEditQuestion={(q) => store.setDialog({ type: 'editQuestion', question: q })}
                    onDeleteQuestion={(id) => store.deleteQuestion(id)}
                    onToggleQuestion={(id) => store.toggleQuestionCompletion(id)}
                    onToggleStarQuestion={(id) => store.toggleStarQuestion(id)}
                    onToggleStarTopic={(id) => store.toggleStarTopic(id)}
                    onToggleStarSubTopic={(id) => store.toggleStarSubTopic(id)}
                    onNotes={(q) => store.setDialog({ type: 'notes', question: q })}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {store.topics.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">No topics yet</p>
            <p className="text-sm text-muted-foreground/70">
              Click "Add Topic" to get started
            </p>
          </div>
        )}
      </main>

      {dialogConfig && (
        <FormDialog
          open={!!dialog}
          onClose={() => store.setDialog(null)}
          title={dialogConfig.title}
          fields={dialogConfig.fields}
          onSubmit={handleDialogSubmit}
        />
      )}

      <DragConfirmDialog state={store.dragConfirmDialog} />
      <DragConfirmDialog state={store.dragConfirmDialog} />
      <ProfileDialog />
      <RandomQuestionDialog
        open={randomDialogOpen}
        onOpenChange={setRandomDialogOpen}
        question={randomQuestion}
      />
      
      {dialog?.type === 'notes' && (
        <NotesDialog
          open={true}
          onClose={() => store.setDialog(null)}
          question={dialog.question}
          onSave={handleSaveNotes}
        />
      )}
    </div>
  );
};

export default Index;
