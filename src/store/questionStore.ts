import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SheetState, Topic, SubTopic, Question, DialogMode } from '@/types';
import { fetchSheetData } from '@/services/api';

const generateId = () => Math.random().toString(36).substring(2, 10);

const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const useQuestionStore = create<SheetState>()(
  persist(
    (set) => ({
  topics: [],
  subTopics: [],
  questions: [],
  isLoading: false,
  error: null,

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const { topics, subTopics, questions } = await fetchSheetData();
      set({ topics, subTopics, questions, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

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
      questions: [
        ...state.questions,
        { ...question, id: `q-${generateId()}`, completed: false },
      ],
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

  toggleQuestionCompletion: (id) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, completed: !q.completed } : q
      ),
    })),
    
    
  toggleStarQuestion: (id) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, isStarred: !q.isStarred } : q
      ),
    })),

  toggleStarTopic: (id) =>
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === id ? { ...t, isStarred: !t.isStarred } : t
      ),
    })),

  toggleStarSubTopic: (id) =>
    set((state) => ({
      subTopics: state.subTopics.map((st) =>
        st.id === id ? { ...st, isStarred: !st.isStarred } : st
      ),
    })),

  isFollowing: false,
  toggleFollowing: () => set((state) => ({ isFollowing: !state.isFollowing })),
  
  profileOpen: false,
  setProfileOpen: (open) => set({ profileOpen: open }),

  // UI State
  dialog: null,
  setDialog: (dialog) => set({ dialog }),
  
  expandedTopics: {},
  toggleTopicExpansion: (id) =>
    set((state) => ({
      expandedTopics: {
        ...state.expandedTopics,
        [id]: !state.expandedTopics[id],
      },
    })),

  expandedSubTopics: {},
  toggleSubTopicExpansion: (id) =>
    set((state) => ({
      expandedSubTopics: {
        ...state.expandedSubTopics,
        [id]: !state.expandedSubTopics[id],
      },
    })),
  
  collapseAll: () => set({ expandedTopics: {}, expandedSubTopics: {} }),
  // Enhanced DnD
  dragConfirmDialog: null,
  setDragConfirmDialog: (dialog) => set({ dragConfirmDialog: dialog }),

  moveQuestion: (id, newTopicId, newSubTopicId, index) =>
    set((state) => {
      const q = state.questions.find((q) => q.id === id);
      if (!q) return {};

      // Remove from old location
      const remainingQuestions = state.questions.filter((q) => q.id !== id);

      // Insert at new location
      const newQuestion = { ...q, topic: newTopicId, subTopic: newSubTopicId };
      const targetQuestions = remainingQuestions.filter(
        (q) => q.topic === newTopicId && q.subTopic === newSubTopicId
      );
      
      // We need to re-insert the question at the correct index among its siblings
      // First, get questions that come BEFORE the insertion point
      const before = targetQuestions.slice(0, index);
      // Get questions that come AFTER
      const after = targetQuestions.slice(index);
      
      // This logic is a bit complex because 'questions' is a flat array.
      // A simpler approach for "index" based insertion in a flat array is:
      // 1. Filter out the moved question.
      // 2. Find the global index of the question that is currently at 'index' in the target group.
      // 3. Insert before that global index.
      
      // Let's refine:
      // Get all questions NOT in the focus group (to keep them)
      const otherQuestions = remainingQuestions.filter(
        (q) => !(q.topic === newTopicId && q.subTopic === newSubTopicId)
      );
      
      const newGroup = [...before, newQuestion, ...after];
      
      return { questions: [...otherQuestions, ...newGroup] };
    }),

  copyQuestion: (id, newTopicId, newSubTopicId, index) =>
    set((state) => {
      const q = state.questions.find((q) => q.id === id);
      if (!q) return {};

      const newQuestion = {
        ...q,
        id: `q-${generateId()}`,
        topic: newTopicId,
        subTopic: newSubTopicId,
        completed: false,
      };

      const targetQuestions = state.questions.filter(
        (q) => q.topic === newTopicId && q.subTopic === newSubTopicId
      );

      const before = targetQuestions.slice(0, index);
      const after = targetQuestions.slice(index);
      
      const otherQuestions = state.questions.filter(
        (q) => !(q.topic === newTopicId && q.subTopic === newSubTopicId)
      );

      const newGroup = [...before, newQuestion, ...after];

      return { questions: [...otherQuestions, ...newGroup] };
    }),

  moveSubTopic: (id, newTopicId, index) =>
    set((state) => {
      const st = state.subTopics.find((st) => st.id === id);
      if (!st) return {};

      // Update SubTopic
      const updatedSubTopic = { ...st, topicId: newTopicId };
      
      // Remove from old list
      const remainingSubTopics = state.subTopics.filter((st) => st.id !== id);
      
      // Insert into new list
      const targetSubTopics = remainingSubTopics.filter((st) => st.topicId === newTopicId);
      const before = targetSubTopics.slice(0, index);
      const after = targetSubTopics.slice(index);
      
      const otherSubTopics = remainingSubTopics.filter((st) => st.topicId !== newTopicId);
      const newSubTopicList = [...otherSubTopics, ...before, updatedSubTopic, ...after];

      // Update Questions: their 'topic' field needs to change, but 'subTopic' ID stays same
      const updatedQuestions = state.questions.map((q) =>
        q.subTopic === id ? { ...q, topic: newTopicId } : q
      );

      return {
        subTopics: newSubTopicList,
        questions: updatedQuestions,
      };
    }),

  copySubTopic: (id, newTopicId, index) =>
    set((state) => {
      const st = state.subTopics.find((st) => st.id === id);
      if (!st) return {};

      const newSubTopicId = `st-${generateId()}`;
      const newSubTopic = { ...st, id: newSubTopicId, topicId: newTopicId };

      // Duplicate Questions
      const relatedQuestions = state.questions.filter((q) => q.subTopic === id);
      const newQuestions = relatedQuestions.map((q) => ({
        ...q,
        id: `q-${generateId()}`,
        topic: newTopicId,
        subTopic: newSubTopicId,
        completed: false,
      }));

      // Insert SubTopic
      const targetSubTopics = state.subTopics.filter((st) => st.topicId === newTopicId);
      const before = targetSubTopics.slice(0, index);
      const after = targetSubTopics.slice(index);
      
      const otherSubTopics = state.subTopics.filter((st) => st.topicId !== newTopicId);
      const newSubTopicList = [...otherSubTopics, ...before, newSubTopic, ...after];

      return {
        subTopics: newSubTopicList,
        questions: [...state.questions, ...newQuestions],
      };
    }),
}), {
  name: 'question-sheet-storage',
  partialize: (state) => ({
    topics: state.topics,
    subTopics: state.subTopics,
    questions: state.questions,
    isFollowing: state.isFollowing,
    profileOpen: false, // Don't persist open state
    expandedTopics: state.expandedTopics,
    expandedSubTopics: state.expandedSubTopics,
  }),
}));
