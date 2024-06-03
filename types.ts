import { Timestamp } from "firebase/firestore";

export type Posts = {
  author: string;
  body: string;
  content: string[];
  timestamp: Timestamp;
  workout_plan: string | null;
};
