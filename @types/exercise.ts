export type ExerciseCategory = {
  name: string
  workouts: Workout[]
}

export type Workout = {
  name: string
  type: string
  sets?: number
  reps?: number
  duration?: number
}
