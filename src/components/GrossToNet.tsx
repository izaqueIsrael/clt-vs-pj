import React, { useState, useEffect, ChangeEvent, useCallback } from "react";

const GrossToNet = () => {
  const [grossSalary, setGrossSalary] = useState<string>("");
  const [netSalary, setNetSalary] = useState<number | null>(null);
  const [INSS, setINSS] = useState<number | null>(null);
  const [IR, setIR] = useState<number | null>(null);

  const calculateINSS = (gross: number): number => {
    let inss = 0;
    if (gross <= 1412.0) {
      inss = gross * 0.075;
    } else if (gross <= 2666.68) {
      inss = 1412 * 0.075 + (gross - 1412) * 0.09;
    } else if (gross <= 4000.03) {
      inss = 1412 * 0.075 + (2666.68 - 1412) * 0.09 + (gross - 2666.68) * 0.12;
    } else if (gross <= 7786.02) {
      inss = 1412 * 0.075 + (2666.68 - 1412) * 0.09 + (4000.03 - 2666.68) * 0.12 + (gross - 4000.03) * 0.14;
    } else {
      inss = 713.10; // Teto máximo de contribuição do INSS
    }
    return inss;
  };

  const getIRDetails = (base: number) => {
    if (base <= 2259.20) return { aliquot: 0.0, deduction: 0 };
    if (base <= 2826.65) return { aliquot: 0.075, deduction: 169.44 };
    if (base <= 3751.05) return { aliquot: 0.15, deduction: 381.44 };
    if (base <= 4664.68) return { aliquot: 0.225, deduction: 662.77 };
    return { aliquot: 0.275, deduction: 896.00 };
  };

  const calculateNetSalary = useCallback((gross: number): void => {
    const INSSvalue = calculateINSS(gross);
    const baseIR = gross - INSSvalue;
    const { aliquot: IRaliquot, deduction: IRDeduction } = getIRDetails(baseIR);
    const IRvalue = baseIR * IRaliquot - IRDeduction;
    const netSalary = gross - INSSvalue - IRvalue;

    setNetSalary(netSalary);
    setIR(IRvalue);
    setINSS(INSSvalue);
  }, []);

  useEffect(() => {
    const parsedGrossSalary = parseFloat(grossSalary);
    if (!isNaN(parsedGrossSalary)) {
      calculateNetSalary(parsedGrossSalary);
    } else {
      setNetSalary(0);
      setIR(null);
      setINSS(null);
    }
  }, [grossSalary, calculateNetSalary]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setGrossSalary(value);
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 p-4 rounded-lg">
      <div className="p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Salário Bruto para o Líquido</h1>
        <div className="mb-4">
          <label className="block text-gray-700">Salário Bruto:</label>
          <input
            type="text"
            value={grossSalary}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mt-4">
          <h2 className="block text-gray-700">Salário Detalhado:</h2>
          {netSalary !== null && (
            <table className="table-auto w-full mt-2 border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Descrição</th>
                  <th className="border border-gray-300 px-4 py-2">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Desconto do INSS</td>
                  <td className="border border-gray-300 px-4 py-2">R$ {INSS?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Desconto do IR</td>
                  <td className="border border-gray-300 px-4 py-2">R$ {IR?.toFixed(2)}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Salário Líquido</td>
                  <td className="border border-gray-300 px-4 py-2">R$ {netSalary?.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrossToNet;
