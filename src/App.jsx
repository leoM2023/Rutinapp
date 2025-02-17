import { useState } from "react";
import { Button } from "../components/button"; 
import { Input } from "../components/input"; 
import { Card, CardContent } from "../components/card";
import { Timer } from "@/components/ui/timer";

export default function WorkoutApp() {
  const [exercises, setExercises] = useState([
    { name: "Press de banca", sets: 3, reps: 10, weight: 50, image: "/bench_press.jpg" },
  ]);
  const [newExercise, setNewExercise] = useState({ name: "", sets: "", reps: "", weight: "" });

  const addExercise = () => {
    if (newExercise.name && newExercise.sets && newExercise.reps && newExercise.weight) {
      setExercises([...exercises, { ...newExercise, image: "/default_exercise.jpg" }]);
      setNewExercise({ name: "", sets: "", reps: "", weight: "" });
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Rutina de Entrenamiento</h1>
      {exercises.map((exercise, index) => (
        <Card key={index} className="mb-4">
          <CardContent>
            <img src={exercise.image} alt={exercise.name} className="w-full h-32 object-cover rounded mb-2" />
            <p className="font-semibold">{exercise.name}</p>
            <p>Series: {exercise.sets} - Reps: {exercise.reps} - Peso: {exercise.weight}kg</p>
          </CardContent>
        </Card>
      ))}
      <div className="flex gap-2 mb-4">
        <Input placeholder="Ejercicio" value={newExercise.name} onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })} />
        <Input placeholder="Series" type="number" value={newExercise.sets} onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })} />
        <Input placeholder="Reps" type="number" value={newExercise.reps} onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })} />
        <Input placeholder="Peso (kg)" type="number" value={newExercise.weight} onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })} />
      </div>
      <Button onClick={addExercise}>Añadir Ejercicio</Button>
      <div className="mt-6">
        <h2 className="text-lg font-bold">Temporizador de descanso</h2>
        <Timer />
      </div>
    </div>
  );
}

