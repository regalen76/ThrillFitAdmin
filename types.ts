import { Timestamp } from "firebase/firestore";
import { string } from "yup";

export type Posts = {
  author: string;
  body: string;
  content: string[];
  timestamp: Timestamp;
  workout_plan: string | null;
};

export type GoalTypes = {
  goal_type_image: string;
  goal_type_name: string;
};

export type TrainingSets = {
  goal_type_id: string;
  training_set_name: string;
};

export type TrainingSetMovements = {
  movement_count: number;
  movement_image: string;
  movement_name: string;
  training_set_id: string;
};
