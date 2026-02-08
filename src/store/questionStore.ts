import { create } from 'zustand';
import type { SheetState, Topic, SubTopic, Question } from '@/types';
import { sampleTopics, sampleSubTopics, sampleQuestions } from '@/data/sampleData';

const generateId = () => Math.random().toString(36).substring(2, 10);

const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const useQuestionStore = create<SheetState>((set) => ({
  topics: sampleTopics,
  subTopics: sampleSubTopics,
  questions: sampleQuestions,

  addTopic: (name) =>
    set((state) => ({
      topics: [...state.topics, { id: `t-${generateId()}`, name }],
    })),

  editTopic: (id, name) =>
    set((state) => ({
      topics: state.topics.map((t) => (t.id === id ? { ...t, name } : t)),
    })),

  deleteTopic: (id) =>
    set((state) => {
      const subTopicIds = state.subTopics.filter((st) => st.topicId === id).map((st) => st.id);
      return {
        topics: state.topics.filter((t) => t.id !== id),
        subTopics: state.subTopics.filter((st) => st.topicId !== id),
        questions: state.questions.filter(
          (q) => q.topic !== id && !subTopicIds.includes(q.subTopic || '')
        ),
      };
    }),

  reorderTopics: (startIndex, endIndex) =>
    set((state) => ({ topics: reorder(state.topics, startIndex, endIndex) })),

  addSubTopic: (topicId, name) =>
    set((state) => ({
      subTopics: [...state.subTopics, { id: `st-${generateId()}`, name, topicId }],
    })),

  editSubTopic: (id, name) =>
    set((state) => ({
      subTopics: state.subTopics.map((st) => (st.id === id ? { ...st, name } : st)),
    })),

  deleteSubTopic: (id) =>
    set((state) => ({
      subTopics: state.subTopics.filter((st) => st.id !== id),
      questions: state.questions.filter((q) => q.subTopic !== id),
    })),

  reorderSubTopics: (topicId, startIndex, endIndex) =>
    set((state) => {
      const topicSubs = state.subTopics.filter((st) => st.topicId === topicId);
      const otherSubs = state.subTopics.filter((st) => st.topicId !== topicId);
      const reordered = reorder(topicSubs, startIndex, endIndex);
      return { subTopics: [...otherSubs, ...reordered] };
    }),

  addQuestion: (question) =>
    set((state) => ({
      questions: [...state.questions, { ...question, id: `q-${generateId()}` }],
    })),

  editQuestion: (id, updates) =>
    set((state) => ({
      questions: state.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    })),

  deleteQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
    })),

  reorderQuestions: (parentId, startIndex, endIndex) =>
    set((state) => {
      const parentQuestions = state.questions.filter(
        (q) => q.subTopic === parentId || (!q.subTopic && q.topic === parentId)
      );
      const otherQuestions = state.questions.filter(
        (q) => q.subTopic !== parentId && (q.subTopic || q.topic !== parentId)
      );
      const reordered = reorder(parentQuestions, startIndex, endIndex);
      return { questions: [...otherQuestions, ...reordered] };
    }),
}));
