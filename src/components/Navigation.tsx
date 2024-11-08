// src/components/Navigation.tsx
import React from "react";

interface NavigationProps {
  setActiveComponent: (component: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ setActiveComponent }) => {
  return (
    <ul className="flex mb-4 gap-2 p-2 bg-gray-600 rounded-md md:mb-0">
      <li className="w-1/3 flex">
        <button
          onClick={() => setActiveComponent("netToGross")}
          className="text-md font-bold font-sans p-1 text-center text-gray-300"
        >
          Líquido para Bruto
        </button>
      </li>
      <li className="w-1/3 flex justify-center border-gray-400 border-r border-l ">
        <button
          onClick={() => setActiveComponent("pjSalaryComparative")}
          className="text-md text-center font-bold font-sans p-1 text-gray-300"
        >
          Custo do Funcionário
        </button>
      </li>
      <li className="w-1/3 flex">
        <button
          onClick={() => setActiveComponent("grossToNet")}
          className="text-md font-bold font-sans p-1 text-center text-gray-300"
        >
          Bruto para Líquido
        </button>
      </li>
    </ul>
  );
};

export default Navigation;
