export interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  link?: string;
  topic: string;
  subTopic?: string;
  notes?: string;
  completed: boolean;
  isStarred?: boolean;
}

export interface SubTopic {
  id: string;
  name: string;
  topicId: string;
  isStarred?: boolean;
}

export interface Topic {
  id: string;
  name: string;
  isStarred?: boolean;
}

export interface SheetState {
  topics: Topic[];
  subTopics: SubTopic[];
  questions: Question[];
  
  // Topic CRUD
  addTopic: (name: string) => void;
  editTopic: (id: string, name: string) => void;
  deleteTopic: (id: string) => void;
  reorderTopics: (startIndex: number, endIndex: number) => void;
  
  // SubTopic CRUD
  addSubTopic: (topicId: string, name: string) => void;
  editSubTopic: (id: string, name: string) => void;
  deleteSubTopic: (id: string) => void;
  reorderSubTopics: (topicId: string, startIndex: number, endIndex: number) => void;
  
  // Question CRUD
  addQuestion: (question: Omit<Question, 'id' | 'completed'>) => void;
  editQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  reorderQuestions: (parentId: string, startIndex: number, endIndex: number) => void;

  toggleQuestionCompletion: (id: string) => void;
  toggleStarQuestion: (id: string) => void;
  
  // Star Actions for Topics/SubTopics
  toggleStarTopic: (id: string) => void;
  toggleStarSubTopic: (id: string) => void;
  
  // User Actions
  isFollowing: boolean;
  toggleFollowing: () => void;
  profileOpen: boolean;
  setProfileOpen: (open: boolean) => void;

  // UI State
  dialog: DialogMode;
  setDialog: (dialog: DialogMode) => void;
  expandedTopics: Record<string, boolean>;
  toggleTopicExpansion: (id: string) => void;
  expandedSubTopics: Record<string, boolean>;

  toggleSubTopicExpansion: (id: string) => void;
  collapseAll: () => void;

  // Async Data
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;

  // Enhanced DnD
  dragConfirmDialog: DragConfirmDialogState;
  setDragConfirmDialog: (state: DragConfirmDialogState) => void;
  moveQuestion: (id: string, newTopicId: string, newSubTopicId: string | undefined, index: number) => void;
  copyQuestion: (id: string, newTopicId: string, newSubTopicId: string | undefined, index: number) => void;
  moveSubTopic: (id: string, newTopicId: string, index: number) => void;
  copySubTopic: (id: string, newTopicId: string, index: number) => void;
}

export type DragConfirmDialogState = {
  isOpen: boolean;
  type: 'question' | 'subTopic';
  sourceId: string;
  sourceName?: string;
  destinationName?: string;
  onConfirm: (action: 'move' | 'copy') => void;
  onCancel: () => void;
} | null;

export type DialogMode =
  | { type: 'addTopic' }
  | { type: 'editTopic'; topic: Topic }
  | { type: 'addSubTopic'; topicId: string }
  | { type: 'editSubTopic'; subTopic: SubTopic }
  | { type: 'addQuestion'; topicId: string; subTopicId?: string }
  | { type: 'editQuestion'; question: Question }
  | null;
