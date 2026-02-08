export interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  link?: string;
  topic: string;
  subTopic?: string;
  notes?: string;
}

export interface SubTopic {
  id: string;
  name: string;
  topicId: string;
}

export interface Topic {
  id: string;
  name: string;
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
  addQuestion: (question: Omit<Question, 'id'>) => void;
  editQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  reorderQuestions: (parentId: string, startIndex: number, endIndex: number) => void;
}
