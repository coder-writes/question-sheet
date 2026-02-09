import type { Question, Topic, SubTopic } from '@/types';

import localData from '@/data/sheet.json';

const API_URL = import.meta.env.VITE_API_URL;

export interface ApiQuestion {
  _id: string;
  topic: string;
  subTopic: string | null;
  questionId: {
    name: string;
    difficulty: string;
    problemUrl: string;
  };
}

export interface ApiResponse {
  status?: {
    code: number;
    success: boolean;
    message: string;
  };
  data: {
    sheet: {
      config: {
        topicOrder: string[];
      };
    };
    questions: ApiQuestion[];
  };
}

// Helper to transform raw API/JSON data into app state format
const transformSheetData = (data: ApiResponse['data']) => {
  const { sheet, questions: apiQuestions } = data;
  const topicOrder = sheet.config.topicOrder;

  // Map Topics
  const topics: Topic[] = topicOrder.map((name) => ({
    id: name,
    name,
  }));

  // Identify unique SubTopics
  const subTopicsMap = new Map<string, SubTopic>();
  const questions: Question[] = [];

  apiQuestions.forEach((q) => {
    // Determine SubTopic if exists
    let subTopicId: string | undefined = undefined;
    if (q.subTopic) {
      subTopicId = `${q.topic}-${q.subTopic}`;
      if (!subTopicsMap.has(subTopicId)) {
        subTopicsMap.set(subTopicId, {
          id: subTopicId,
          name: q.subTopic,
          topicId: q.topic,
        });
      }
    }

    // Map Question
    questions.push({
      id: q._id,
      title: q.questionId.name,
      difficulty: q.questionId.difficulty as 'Easy' | 'Medium' | 'Hard',
      link: q.questionId.problemUrl,
      topic: q.topic,
      subTopic: subTopicId,
      completed: false,
    });
  });

  // Hardcoded Subtopics (Preserved for backward compatibility/ensuring structure)
  const HARDCODED_SUBTOPICS: Record<string, string[]> = {
    'Arrays': ['Sorting', 'Two Pointer', 'Sliding Window'],
    'Arrays Part-II': ['Kadane\'s Algorithm', 'Merge Overlapping'],
    'Linked List': ['Singly Linked List', 'Doubly Linked List', 'Fast & Slow Pointer'],
    'Greedy Algorithm': ['Interval Problems', 'Scheduling'],
    'Binary Search': ['1D Arrays', '2D Arrays', 'Search Space'],
    'Stack and Queue': ['Monotonic Stack', 'Implementation'],
    'String': ['Basic String', 'Pattern Matching'],
    'Binary Tree': ['Traversals', 'Construction', 'Height & Depth'],
    'Dynamic Programming': ['1D DP', '2D DP', 'DP on Grids', 'DP on Strings'],
    'Graph': ['BFS/DFS', 'Topological Sort', 'Shortest Path', 'MST'],
    'Recursion': ['Basic Recursion', 'Backtracking'],
    'Linked List and Arrays': ['Copy List', '3 Sum'],
    'Recursion and Backtracking': ['Permutations', 'N-Queens'],
    'Binary Search Tree': ['Concepts', 'Construction'],
    'Binary Tree (Miscellaneous)': ['LCA', 'Serialize'],
    'Stack and Queue Part-II': ['LRU Cache', 'Largest Rectangle'],
    'Trie': ['Implementation', 'Bit Manipulation'],
    'Heaps': ['Implementation', 'Kth Element'],
  };

  topics.forEach((topic) => {
    const subTopicNames = HARDCODED_SUBTOPICS[topic.name];
    if (subTopicNames) {
      subTopicNames.forEach((stName) => {
        const subTopicId = `${topic.id}-${stName}`;
        if (!subTopicsMap.has(subTopicId)) {
          subTopicsMap.set(subTopicId, {
            id: subTopicId,
            name: stName,
            topicId: topic.id,
          });
        }
      });
    }
  });

  return {
    topics,
    subTopics: Array.from(subTopicsMap.values()),
    questions,
  };
};

export const fetchSheetData = async (): Promise<{ topics: Topic[]; subTopics: SubTopic[]; questions: Question[] }> => {
  try {
    console.log('Fetching from API:', API_URL);
    const response = await fetch(API_URL);
    const json: ApiResponse = await response.json();

    if (json.status && !json.status.success) {
      throw new Error(json.status.message || 'Failed to fetch sheet data');
    }

    return transformSheetData(json.data);
  } catch (error) {
    console.warn('API Fetch failed, using local fallback data:', error);
    // Fallback to local data
    // The local JSON structure matches the 'ApiResponse' interface roughly,
    // but might miss the 'status' wrapper or match the 'data' part directly 
    // depending on how it was saved.
    // Based on the file content provided:
    // { "data": { "sheet": ..., "questions": ... } }
    return transformSheetData((localData as unknown as ApiResponse).data);
  }
};
