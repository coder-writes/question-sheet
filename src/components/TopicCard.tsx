import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import type { Topic, SubTopic, Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import QuestionRow from './QuestionRow';

interface TopicCardProps {
  topic: Topic;
  index: number;
  subTopics: SubTopic[];
  questions: Question[];
  onEditTopic: (topic: Topic) => void;
  onDeleteTopic: (id: string) => void;
  onAddSubTopic: (topicId: string) => void;
  onEditSubTopic: (subTopic: SubTopic) => void;
  onDeleteSubTopic: (id: string) => void;
  onAddQuestion: (topicId: string, subTopicId?: string) => void;
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion: (id: string) => void;
}

const TopicCard = ({
  topic,
  index,
  subTopics,
  questions,
  onEditTopic,
  onDeleteTopic,
  onAddSubTopic,
  onEditSubTopic,
  onDeleteSubTopic,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}: TopicCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [expandedSubs, setExpandedSubs] = useState<Record<string, boolean>>({});

  const topicQuestions = questions.filter((q) => q.topic === topic.id);
  const directQuestions = topicQuestions.filter((q) => !q.subTopic);

  const toggleSub = (id: string) => {
    setExpandedSubs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Draggable draggableId={topic.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`overflow-hidden rounded-xl border bg-card transition-shadow ${
            snapshot.isDragging ? 'shadow-xl ring-2 ring-primary/20' : 'shadow-sm'
          }`}
        >
          {/* Topic Header */}
          <div className="flex items-center gap-2 px-4 py-3">
            <div
              {...provided.dragHandleProps}
              className="drag-handle flex-shrink-0 text-muted-foreground/40 transition-colors hover:text-muted-foreground"
            >
              <GripVertical className="h-5 w-5" />
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex flex-1 items-center gap-2"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4 text-primary" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <h2 className="font-display text-base font-semibold">{topic.name}</h2>
              <Badge variant="secondary" className="ml-1 text-xs">
                {topicQuestions.length}
              </Badge>
            </button>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onAddSubTopic(topic.id)}
                title="Add sub-topic"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onEditTopic(topic)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => onDeleteTopic(topic.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Expanded content */}
          {expanded && (
            <div className="border-t px-4 pb-4 pt-2">
              {/* Sub-topics */}
              <Droppable droppableId={`subTopics-${topic.id}`} type="subTopic">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {subTopics.map((subTopic, index) => {
                      const subQuestions = questions.filter((q) => q.subTopic === subTopic.id);
                      const isSubExpanded = expandedSubs[subTopic.id] ?? true;

                      return (
                        <Draggable key={subTopic.id} draggableId={subTopic.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`mt-2 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                            >
                              <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
                                >
                                  <GripVertical className="h-4 w-4" />
                                </div>
                                <button
                                  onClick={() => toggleSub(subTopic.id)}
                                  className="flex flex-1 items-center gap-2"
                                >
                                  {isSubExpanded ? (
                                    <ChevronDown className="h-3.5 w-3.5 text-primary" />
                                  ) : (
                                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                  )}
                                  <span className="text-sm font-medium">{subTopic.name}</span>
                                  <Badge variant="outline" className="text-[10px]">
                                    {subQuestions.length}
                                  </Badge>
                                </button>
                                <div className="flex gap-0.5">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => onAddQuestion(topic.id, subTopic.id)}
                                    title="Add question"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => onEditSubTopic(subTopic)}
                                  >
                                    <Pencil className="h-2.5 w-2.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                    onClick={() => onDeleteSubTopic(subTopic.id)}
                                  >
                                    <Trash2 className="h-2.5 w-2.5" />
                                  </Button>
                                </div>
                              </div>

                              {isSubExpanded && subQuestions.length > 0 && (
                                <Droppable droppableId={`questions-${subTopic.id}`} type="question">
                                  {(droppableProvided) => (
                                    <div
                                      ref={droppableProvided.innerRef}
                                      {...droppableProvided.droppableProps}
                                      className="ml-4 mt-1 space-y-0.5"
                                    >
                                      {subQuestions.map((q, qi) => (
                                        <QuestionRow
                                          key={q.id}
                                          question={q}
                                          index={qi}
                                          onEdit={onEditQuestion}
                                          onDelete={onDeleteQuestion}
                                        />
                                      ))}
                                      {droppableProvided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              )}
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* Direct questions (no sub-topic) */}
              {directQuestions.length > 0 && (
                <Droppable droppableId={`questions-${topic.id}`} type="question">
                  {(droppableProvided) => (
                    <div
                      ref={droppableProvided.innerRef}
                      {...droppableProvided.droppableProps}
                      className="mt-2 space-y-0.5"
                    >
                      {directQuestions.map((q, qi) => (
                        <QuestionRow
                          key={q.id}
                          question={q}
                          index={qi}
                          onEdit={onEditQuestion}
                          onDelete={onDeleteQuestion}
                        />
                      ))}
                      {droppableProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}

              {/* Add question to topic directly */}
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 w-full justify-start gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={() => onAddQuestion(topic.id)}
              >
                <Plus className="h-3.5 w-3.5" />
                Add question
              </Button>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TopicCard;
