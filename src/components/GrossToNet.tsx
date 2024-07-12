import React, { useState, useEffect, ChangeEvent, useCallback } from "react";

const GrossToNet = () => {
  const [grossSalary, setGrossSalary] = useState<string>("");
  const [netSalary, setNetSalary] = useState<number | null>(null);
  const [FGTS, setFGTS] = useState<number | null>(null);
  const [INSS, setINSS] = useState<number | null>(null);
  const [IR, setIR] = useState<number | null>(null);
  const [INSSPatronal, setINSSPatronal] = useState<number | null>(null);
  const [bossCost, setBossCost] = useState<number | null>(null);

  const getINSSDetails = (
    gross: number
  ): { INSSaliquot: number; INSSDeduction: number } => {
    if (gross <= 1412.0) return { INSSaliquot: 0.075, INSSDeduction: 0 };
    if (gross <= 2666.68) return { INSSaliquot: 0.09, INSSDeduction: 21.18 };
    if (gross <= 4000.03) return { INSSaliquot: 0.12, INSSDeduction: 101.18 };
    if (gross <= 7786.02) return { INSSaliquot: 0.14, INSSDeduction: 181.18 };
    throw new Error("Salário bruto fora do intervalo válido");
  };

  const getIRDetails = (
    gross: number,
    INSSvalue: number
  ): { IRaliquot: number; IRDeduction: number } => {
    const base = gross - INSSvalue;
    if (base <= 2259.20) return { IRaliquot: 0.0, IRDeduction: 0 };
    if (base <= 2826.65) return { IRaliquot: 0.075, IRDeduction: 169.44 };
    if (base <= 3751.05) return { IRaliquot: 0.15, IRDeduction: 381.44 };
    if (base <= 4664.68) return { IRaliquot: 0.225, IRDeduction: 662.77 };
    return { IRaliquot: 0.275, IRDeduction: 896.00 };
  };

  const calculateNetSalary = useCallback((gross: number): void => {
    let INSSvalue = 0;
    if (gross > 7786.02) {
      const { INSSaliquot, INSSDeduction } = getINSSDetails(7786.02);
      INSSvalue = 7786.02 * INSSaliquot - INSSDeduction;
    } else {
      const { INSSaliquot, INSSDeduction } = getINSSDetails(gross);
      INSSvalue = gross * INSSaliquot - INSSDeduction;
    }

    const { IRaliquot, IRDeduction } = getIRDetails(gross, INSSvalue);
    const IRvalue = (gross - INSSvalue) * IRaliquot - IRDeduction;

    const FGTSvalue = gross * 0.08;

    const netSalary = gross - INSSvalue - IRvalue - FGTSvalue;
    setNetSalary(netSalary);
    setFGTS(FGTSvalue);
    setIR(IRvalue);
    setINSS(INSSvalue);
    setINSSPatronal(gross * 0.2);
    setBossCost(gross * 1.2);
  }, []);

  useEffect(() => {
    const parsedGrossSalary = parseFloat(grossSalary);
    if (!isNaN(parsedGrossSalary)) {
      calculateNetSalary(parsedGrossSalary);
    } else {
      setNetSalary(0);
      setFGTS(null);
      setIR(null);
      setINSS(null);
      setINSSPatronal(null);
      setBossCost(null);
    }
  }, [grossSalary, calculateNetSalary]);

  // Handler for input change
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
          <label className="block text-gray-700">Gross Salary:</label>
          <input
            type="text"
            value={grossSalary}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mt-4 flex flex-col justify-center">
          <h2 className="block text-gray-700">Net Salary:</h2>
          <div className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm">
            {netSalary !== null && (
              <ul className="rounded-lg flex flex-col gap-1">
                <li>
                  Salário Líquido:{" "}
                  <span className="font-bold">R$ {netSalary.toFixed(2)}</span>
                </li>
                <li>Desconto do FGTS:<span className="font-bold">R$ {FGTS?.toFixed(2)}</span> </li>
                <li>Desconto do INSS:<span className="font-bold">R$ {INSS?.toFixed(2)}</span> </li>
                <li>Desconto do IR: <span className="font-bold">R$ {IR?.toFixed(2)}</span></li>
                <li>Custo do Patrão: <span className="font-bold">R$ {bossCost?.toFixed(2)}</span> </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrossToNet;
