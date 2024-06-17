import { Timestamp } from "firebase/firestore";
import { string } from "yup";

export type Posts = {
  author: string;
  body: string;
  content: string[];
  timestamp: Timestamp;
  workout_plan: string | null;
};

export type Post = {
  id: string;
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

export type GoalType = {
  id: string;
  goal_type_image: string;
  goal_type_name: string;
};

export type TrainingSets = {
  goal_type_id: string;
  training_set_name: string;
};

export type TrainingSet = {
  id: string;
  goal_type_id: string;
  training_set_name: string;
};

export type TrainingSetMovements = {
  movement_image: string;
  movement_name: string;
  training_set_id: string;
};

export type TrainingSetMovement = {
  id: string;
  movement_image: string;
  movement_name: string;
  training_set_id: string;
};

export type WorkoutPlanMovesets = {
  movement_id: string;
  view_order: number;
  workout_plan_id: string;
};
