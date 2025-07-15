import React, { useState } from "react";
import { FaCow } from "react-icons/fa6";
import { GiGoat, GiChicken, GiPig } from "react-icons/gi";
import AnimalForm from "../components/AnimalForm";

function AddAnimal() {
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const animals = [
    { name: "Cows", icon: <FaCow size={64} className="text-green-700" /> },
    { name: "Goats", icon: <GiGoat size={64} className="text-green-700" /> },
    { name: "Chicken", icon: <GiChicken size={64} className="text-green-700" /> },
    { name: "Pigs", icon: <GiPig size={64} className="text-green-700" /> },
  ];

  function handleCardClick(animalName) {
    setSelectedAnimal(animalName);
  }

  function handleFormSubmit(data) {
    setSelectedAnimal(null);
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center pt-20 pb-8">
      <h2 className="text-3xl font-bold mb-8">Add Your Animals</h2>
      {!selectedAnimal ? (
        <div className="grid grid-cols-2 gap-8 w-full max-w-3xl mb-8">
          {animals.map((animal) => (
            <div
              key={animal.name}
              className="flex flex-col items-center justify-center p-10 rounded-2xl shadow-xl bg-gray-100 text-gray-800 cursor-pointer hover:scale-105 transition w-full h-72"
              onClick={() => handleCardClick(animal.name)}
            >
              <div className="mb-4">{animal.icon}</div>
              <div className="font-semibold text-2xl">{animal.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <AnimalForm
            animalType={selectedAnimal}
            onSubmit={handleFormSubmit}
          />
          <button
            className="mt-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
            onClick={() => setSelectedAnimal(null)}
          >
            Back to Animal Cards
          </button>
        </div>
      )}
    </div>
  );
}

export default AddAnimal;