import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent } from './components/ui/card';
import Timer from './components/timer/timer';
import './styles.css';

const initialExercises = [
  {
    day: "DIA 1",
    exercises: [
      { name: "CUADRICEPS", sets: 3, reps: 10, weight: [40, 45], notes: "3x12" },
      { name: "IZQUIOTIBIALES", sets: 3, reps: 10, weight: 40 },
      { name: "GEMELOS", sets: 3, reps: 10, weight: [50, 140] },
      { name: "PRENSA", sets: 3, reps: 10, weight: 110 },
      { name: "BICEPS CON MANC", sets: 3, reps: 10, weight: [12.5, 15] },
      { name: "BICEPS W", sets: 3, reps: 10, weight: 20 },
    ]
  },
  {
    day: "DIA 2",
    exercises: [
      { name: "JALON AL PECHO", sets: 3, reps: 10, weight: [55, 85] },
      { name: "REMO EN MAQUINA", sets: 3, reps: 10, weight: 55 },
      { name: "REMO UN BRAZO", sets: 3, reps: 10, weight: 22.5 },
      { name: "PULLOVER", sets: 3, reps: 10, weight: 22.5 },
      { name: "VUELOS LATERALES", sets: 3, reps: 10, weight: [7.5, 10] },
      { name: "PRESS DE HOMBROS", sets: 3, reps: 10, weight: [5, 22.5, 25], notes: "maq" },
    ]
  },
  {
    day: "DIA 3",
    exercises: [
      { name: "APERTURA", sets: 3, reps: 10, weight: [40, 45, 50] },
      { name: "PRESS PLANO", sets: 3, reps: 10, weight: [30, 35, 40] },
      { name: "PRESS INCL", sets: 3, reps: 10, weight: [15, 20, 25] },
      { name: "TRICEPS POLEA C/BARRA", sets: 3, reps: 15, weight: [10, 20, 25, 30] },
      { name: "TRICEPS EN POLEA C/SOGA", sets: 3, reps: 10, weight: [10, 20] },
      { name: "EXTENSION DE BRAZO", sets: 3, reps: 10, weight: 5 },
    ]
  }
];

export default function WorkoutApp() {
  const [exercises, setExercises] = useState(initialExercises);
  const [searchTerm, setSearchTerm] = useState("");
  const [newExercise, setNewExercise] = useState({ name: "", sets: 0, reps: 0, weight: "" });
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);

  const handleInputChange = (dayIndex, exerciseIndex, field, value) => {
    const updatedExercises = exercises.map((day, dIdx) => {
      if (dIdx === dayIndex) {
        const updatedDay = {
          ...day,
          exercises: day.exercises.map((exercise, eIdx) => {
            if (eIdx === exerciseIndex) {
              return {
                ...exercise,
                [field]: field === 'weight' ? value.split(',').map(Number) : value
              };
            }
            return exercise;
          })
        };
        return updatedDay;
      }
      return day;
    });

    setExercises(updatedExercises);
  };

  const handleNewExerciseChange = (field, value) => {
    setNewExercise({ ...newExercise, [field]: value });
  };

  const handleAddExercise = () => {
    if (selectedDayIndex === null) return;
    const updatedExercises = exercises.map((day, dIdx) => {
      if (dIdx === selectedDayIndex) {
        return {
          ...day,
          exercises: [...day.exercises, { ...newExercise, weight: newExercise.weight.split(',').map(Number), notes: "" }]
        };
      }
      return day;
    });

    setExercises(updatedExercises);
    setNewExercise({ name: "", sets: 0, reps: 0, weight: "" });
  };

  const handleRemoveExercise = (dayIndex, exerciseIndex) => {
    const updatedExercises = exercises.map((day, dIdx) => {
      if (dIdx === dayIndex) {
        const updatedDay = {
          ...day,
          exercises: day.exercises.filter((_, eIdx) => eIdx !== exerciseIndex)
        };
        return updatedDay;
      }
      return day;
    });

    setExercises(updatedExercises);
  };

  const filteredExercises = exercises.filter(day =>
    day.exercises.some(exercise =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container">
      <h1 className="text-xl font-bold mb-4">Rutina de Entrenamiento</h1>
      <Input 
        placeholder="Buscar Ejercicio" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="mb-4"
      />
      {filteredExercises.length > 0 ? filteredExercises.map((day, dayIndex) => (
        <div key={dayIndex}>
          <h2 className="text-lg font-bold">{day.day}</h2>
          {day.exercises.map((exercise, exerciseIndex) => (
            <Card key={exerciseIndex} className="card mb-4">
              <CardContent>
                <p className="font-semibold">{exercise.name}</p>
                <div className="flex space-x-4">
                  <div>
                    <label>Series: </label>
                    <input
                      type="number"
                      value={exercise.sets}
                      onChange={(e) => handleInputChange(dayIndex, exerciseIndex, 'sets', e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Reps: </label>
                    <input
                      type="number"
                      value={exercise.reps}
                      onChange={(e) => handleInputChange(dayIndex, exerciseIndex, 'reps', e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Peso: </label>
                    <input
                      type="text"
                      value={Array.isArray(exercise.weight) ? exercise.weight.join(',') : exercise.weight}
                      onChange={(e) => handleInputChange(dayIndex, exerciseIndex, 'weight', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label>Notas: </label>
                  <input
                    type="text"
                    value={exercise.notes || ""}
                    onChange={(e) => handleInputChange(dayIndex, exerciseIndex, 'notes', e.target.value)}
                  />
                </div>
                <Button onClick={() => handleRemoveExercise(dayIndex, exerciseIndex)} className="bg-red-500 text-white mt-2">Eliminar</Button>
              </CardContent>
            </Card>
          ))}
          <div className="mt-6">
            <h2 className="text-lg font-bold">Temporizador de descanso</h2>
            <div className="timer">
              <Timer />
            </div>
          </div>
        </div>
      )) : (
        <p>No se encontraron ejercicios.</p>
      )}
      <div className="new-exercise-form mt-6">
        <h3>Añadir Nuevo Ejercicio</h3>
        <div>
          <label>Seleccionar Día: </label>
          <select onChange={(e) => setSelectedDayIndex(Number(e.target.value))}>
            <option value="">Selecciona un día</option>
            {exercises.map((day, index) => (
              <option key={index} value={index}>{day.day}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Nombre: </label>
          <input
            type="text"
            value={newExercise.name}
            onChange={(e) => handleNewExerciseChange('name', e.target.value)}
          />
        </div>
        <div>
          <label>Series: </label>
          <input
            type="number"
            value={newExercise.sets}
            onChange={(e) => handleNewExerciseChange('sets', e.target.value)}
          />
        </div>
        <div>
          <label>Reps: </label>
          <input
            type="number"
            value={newExercise.reps}
            onChange={(e) => handleNewExerciseChange('reps', e.target.value)}
          />
        </div>
        <div>
          <label>Peso: </label>
          <input
            type="text"
            value={newExercise.weight}
            onChange={(e) => handleNewExerciseChange('weight', e.target.value)}
          />
        </div>
        <Button onClick={handleAddExercise} className="bg-green-500 text-white mt-2">Agregar Ejercicio</Button>
      </div>
    </div>
  );
}