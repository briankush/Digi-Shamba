import React from "react";
import { FaCow } from "react-icons/fa6";
import { GiGoat, GiChicken, GiPig } from "react-icons/gi";

function Dashboard() {
  const animals = [
    { name: "Cows", icon: <FaCow size={64} className="text-green-700" /> },
    { name: "Goats", icon: <GiGoat size={64} className="text-green-700" /> },
    { name: "Chicken", icon: <GiChicken size={64} className="text-green-700" /> },
    { name: "Pigs", icon: <GiPig size={64} className="text-green-700" /> },
  ];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center py-8">
      <h2 className="text-3xl font-bold mb-8">Add Your Animals</h2>
      <div className="grid grid-cols-2 gap-8 w-full max-w-3xl">
        {animals.map((animal) => (
          <div
            key={animal.name}
            className="flex flex-col items-center justify-center p-10 rounded-2xl shadow-xl bg-gray-100 text-gray-800 cursor-pointer hover:scale-105 transition w-full h-72"
          >
            <div className="mb-4">{animal.icon}</div>
            <div className="font-semibold text-2xl">{animal.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
