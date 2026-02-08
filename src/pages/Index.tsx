import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import { useQuestionStore } from '@/store/questionStore';
import type { Topic, SubTopic, Question } from '@/types';
import Header from '@/components/Header';
import TopicCard from '@/components/TopicCard';
import FormDialog from '@/components/FormDialog';

type DialogMode =
  | { type: 'addTopic' }
  | { type: 'editTopic'; topic: Topic }
  | { type: 'addSubTopic'; topicId: string }
  | { type: 'editSubTopic'; subTopic: SubTopic }
  | { type: 'addQuestion'; topicId: string; subTopicId?: string }
  | { type: 'editQuestion'; question: Question }
  | null;

const Index = () => {
  const store = useQuestionStore();
  const [dialog, setDialog] = useState<DialogMode>(null);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination, type } = result;
      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index) return;

      if (type === 'topic') {
        store.reorderTopics(source.index, destination.index);
      } else if (type === 'subTopic') {
        const topicId = source.droppableId.replace('subTopics-', '');
        store.reorderSubTopics(topicId, source.index, destination.index);
      } else if (type === 'question') {
        const parentId = source.droppableId.replace('questions-', '');
        store.reorderQuestions(parentId, source.index, destination.index);
      }
    },
    [store]
  );

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
    },
    [dialog, store]
  );

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

  return (
    <div className="min-h-screen bg-background">
      <Header
        totalQuestions={store.questions.length}
        totalTopics={store.topics.length}
        onAddTopic={() => setDialog({ type: 'addTopic' })}
      />

      <main className="container mx-auto px-4 py-6 sm:px-6">
        <DragDropContext onDragEnd={handleDragEnd}>
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
                    onEditTopic={(t) => setDialog({ type: 'editTopic', topic: t })}
                    onDeleteTopic={(id) => store.deleteTopic(id)}
                    onAddSubTopic={(topicId) => setDialog({ type: 'addSubTopic', topicId })}
                    onEditSubTopic={(st) => setDialog({ type: 'editSubTopic', subTopic: st })}
                    onDeleteSubTopic={(id) => store.deleteSubTopic(id)}
                    onAddQuestion={(topicId, subTopicId) =>
                      setDialog({ type: 'addQuestion', topicId, subTopicId })
                    }
                    onEditQuestion={(q) => setDialog({ type: 'editQuestion', question: q })}
                    onDeleteQuestion={(id) => store.deleteQuestion(id)}
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
          onClose={() => setDialog(null)}
          title={dialogConfig.title}
          fields={dialogConfig.fields}
          onSubmit={handleDialogSubmit}
        />
      )}
    </div>
  );
};

export default Index;
