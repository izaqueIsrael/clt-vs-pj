import React, { useState } from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <p>
          Para calcular o quanto o patrão gasta com você para te manter na CLT navegue para /netToGross
        </p>
        <p>
          Para calcular o salário líquido a partir do bruto navegue para /grossToNet
        </p>
        <p>
          Para calcular o quanto você ganharia se fosse CLT em um emprego PJ navegue para /PJSalaryComparative
        </p>
      </div>
    </div>
  );
};

export default Home;
