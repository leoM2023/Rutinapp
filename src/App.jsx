import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Timer from './components/timer/timer.jsx';
import './styles.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const initialExercises = [
  {
    day: "DIA 1",
    exercises: [
      { id: '1', name: "CUADRICEPS", sets: 3, reps: 10, weight: [40, 45], notes: "3x12" },
      { id: '2', name: "IZQUIOTIBIALES", sets: 3, reps: 10, weight: 40 },
      { id: '3', name: "GEMELOS", sets: 3, reps: 10, weight: [50, 140] },
      { id: '4', name: "PRENSA", sets: 3, reps: 10, weight: 110 },
      { id: '5', name: "BICEPS CON MANC", sets: 3, reps: 10, weight: [12.5, 15] },
      { id: '6', name: "BICEPS W", sets: 3, reps: 10, weight: 20 },
    ]
  },
  {
    day: "DIA 2",
    exercises: [
      { id: '7', name: "JALON AL PECHO", sets: 3, reps: 10, weight: [55, 85] },
      { id: '8', name: "REMO EN MAQUINA", sets: 3, reps: 10, weight: 55 },
      { id: '9', name: "REMO UN BRAZO", sets: 3, reps: 10, weight: 22.5 },
      { id: '10', name: "PULLOVER", sets: 3, reps: 10, weight: 22.5 },
      { id: '11', name: "VUELOS LATERALES", sets: 3, reps: 10, weight: [7.5, 10] },
      { id: '12', name: "PRESS DE HOMBROS", sets: 3, reps: 10, weight: [5, 22.5, 25], notes: "maq" },
    ]
  },
  {
    day: "DIA 3",
    exercises: [
      { id: '13', name: "APERTURA", sets: 3, reps: 10, weight: [40, 45, 50] },
      { id: '14', name: "PRESS PLANO", sets: 3, reps: 10, weight: [30, 35, 40] },
      { id: '15', name: "PRESS INCL", sets: 3, reps: 10, weight: [15, 20, 25] },
      { id: '16', name: "TRICEPS POLEA C/BARRA", sets: 3, reps: 15, weight: [10, 20, 25, 30] },
      { id: '17', name: "TRICEPS EN POLEA C/SOGA", sets: 3, reps: 10, weight: [10, 20] },
      { id: '18', name: "EXTENSION DE BRAZO", sets: 3, reps: 10, weight: 5 },
    ]
  }
];

const App = () => {
  const [exercises, setExercises] = useState(initialExercises);
  const [newExercise, setNewExercise] = useState({ id: '', name: "", sets: 0, reps: 0, weight: "" });
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);

  useEffect(() => {
    serviceWorkerRegistration.register();
  }, []);

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
    setNewExercise({ ...newExercise, [field]: value, id: `${Date.now()}` });
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
    setNewExercise({ id: '', name: "", sets: 0, reps: 0, weight: "" });
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

  const moveExercise = (dayIndex, exerciseIndex, direction) => {
    const newIndex = exerciseIndex + direction;
    if (newIndex < 0 || newIndex >= exercises[dayIndex].exercises.length) return;

    const updatedExercises = exercises.map((day, dIdx) => {
      if (dIdx === dayIndex) {
        const updatedDay = {
          ...day,
          exercises: [...day.exercises]
        };
        const [movedExercise] = updatedDay.exercises.splice(exerciseIndex, 1);
        updatedDay.exercises.splice(newIndex, 0, movedExercise);
        return updatedDay;
      }
      return day;
    });

    setExercises(updatedExercises);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceDayIndex = parseInt(source.droppableId.split('-')[1]);
    const destinationDayIndex = parseInt(destination.droppableId.split('-')[1]);

    if (sourceDayIndex !== destinationDayIndex) return;

    const updatedDayExercises = Array.from(exercises[sourceDayIndex].exercises);
    const [movedExercise] = updatedDayExercises.splice(source.index, 1);
    updatedDayExercises.splice(destination.index, 0, movedExercise);

    const updatedExercises = exercises.map((day, dIdx) => {
      if (dIdx === sourceDayIndex) {
        return {
          ...day,
          exercises: updatedDayExercises
        };
      }
      return day;
    });

    setExercises(updatedExercises);
  };

  return (
    <div className="container">
      <h1 className="text-xl font-bold mb-4 centered">Rutina de Entrenamiento</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        {exercises.map((day, dayIndex) => (
          <div key={dayIndex} className="day-container centered">
            <h2 className="text-lg font-bold centered">{day.day}</h2>
            <Droppable droppableId={`droppable-${dayIndex}`}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {day.exercises.map((exercise, exerciseIndex) => (
                    <Draggable key={exercise.id} draggableId={exercise.id} index={exerciseIndex}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="draggable-item"
                        >
                          <div className="card mb-4">
                            <div className="card-content">
                              <p className="font-semibold text-left">{exercise.name}</p>
                              <div className="exercise-inputs">
                                <div className="input-group">
                                  <label>Series: </label>
                                  <input
                                    type="number"
                                    value={exercise.sets}
                                    onChange={(e) => handleInputChange(dayIndex, exerciseIndex, 'sets', e.target.value)}
                                  />
                                </div>
                                <div className="input-group">
                                  <label>Reps: </label>
                                  <input
                                    type="number"
                                    value={exercise.reps}
                                    onChange={(e) => handleInputChange(dayIndex, exerciseIndex, 'reps', e.target.value)}
                                  />
                                </div>
                                <div className="input-group">
                                  <label>Peso: </label>
                                  <input
                                    type="text"
                                    value={Array.isArray(exercise.weight) ? exercise.weight.join(',') : exercise.weight}
                                    onChange={(e) => handleInputChange(dayIndex, exerciseIndex, 'weight', e.target.value)}
                                  />
                                </div>
                                <div className="input-group">
                                  <label>Notas: </label>
                                  <input
                                    type="text"
                                    value={exercise.notes || ""}
                                    onChange={(e) => handleInputChange(dayIndex, exerciseIndex, 'notes', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="timer-small">
                                <Timer />
                              </div>
                              <div className="button-container mt-2">
                                <div className="move-buttons">
                                  <button onClick={() => moveExercise(dayIndex, exerciseIndex, -1)} className="btn btn-blue mr-2">Subir</button>
                                  <button onClick={() => moveExercise(dayIndex, exerciseIndex, 1)} className="btn btn-blue">Bajar</button>
                                </div>
                                <button onClick={() => handleRemoveExercise(dayIndex, exerciseIndex)} className="btn btn-red mt-2">Eliminar</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
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
        <div className="exercise-inputs">
          <div className="input-group">
            <label>Series: </label>
            <input
              type="number"
              value={newExercise.sets}
              onChange={(e) => handleNewExerciseChange('sets', e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Reps: </label>
            <input
              type="number"
              value={newExercise.reps}
              onChange={(e) => handleNewExerciseChange('reps', e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Peso: </label>
            <input
              type="text"
              value={newExercise.weight}
              onChange={(e) => handleNewExerciseChange('weight', e.target.value)}
            />
          </div>
        </div>
        <button onClick={handleAddExercise} className="btn btn-blue mt-2">Agregar Ejercicio</button>
      </div>
    </div>
  );
};

export default App;