import React, { useState, ChangeEvent, useEffect, useCallback } from "react";

const PJSalaryComparative = () => {
  const [grossSalary, setGrossSalary] = useState<number | null>(null);
  const [netSalary, setNetSalary] = useState<number | null>(null);
  const [FGTS, setFGTS] = useState<number | null>(null);
  const [INSS, setINSS] = useState<number | null>(null);
  const [IR, setIR] = useState<number | null>(null);
  const [INSSPatronal, setINSSPatronal] = useState<number | null>(null);
  const [bossCost, setBossCost] = useState<string>("");
  const [thirteenSalary, setThirteenSalary] = useState<number | null>(0);
  const [vacations, setVacations] = useState<number | null>(0);

  const getINSSDetails = (
    gross: number
  ): { INSSaliquot: number; INSSDeduction: number } => {
    if (gross <= 1412.0) return { INSSaliquot: 0.075, INSSDeduction: 0 };
    if (gross <= 2666.68) return { INSSaliquot: 0.09, INSSDeduction: 21.18 };
    if (gross <= 4000.03) return { INSSaliquot: 0.12, INSSDeduction: 101.18 };
    if (gross <= 7786.02) return { INSSaliquot: 0.14, INSSDeduction: 181.18 };
    throw new Error("Salário bruto fora do intervalo válido");
  };

  const getIRDetails = (gross: number, INSSvalue: number) => {
    const base = gross - INSSvalue;
    if (base <= 2259.20) return { IRaliquot: 0.0, IRDeduction: 0 };
    if (base <= 2826.65) return { IRaliquot: 0.075, IRDeduction: 169.44 };
    if (base <= 3751.05) return { IRaliquot: 0.15, IRDeduction: 381.44 };
    if (base <= 4664.68) return { IRaliquot: 0.225, IRDeduction: 662.77 };
    return { IRaliquot: 0.275, IRDeduction: 896.00 };
  };

  const calculateCLTsalary = useCallback((bossCost: string): void => {
    const parsedBossCost = parseFloat(bossCost);
    if (isNaN(parsedBossCost)) return;

    let gross = parsedBossCost / (1 + 0.2 + 2 / 11);
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
    setThirteenSalary(gross / 12);
    setVacations(gross / 12);
    setGrossSalary(gross * 1.2);
  }, []);

  // Handler for input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setBossCost(value);
      calculateCLTsalary(value);
    }
  };

  useEffect(() => {
    calculateCLTsalary(bossCost);
  }, [bossCost, calculateCLTsalary]);

  return (
    <div className="bg-gray-100 rounded-lg p-4 flex flex-col gap-3">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Calculadora de Salário PJ para CLT
      </h1>
      <h4 className="text-xs mb-4">
        Por conta das divergências dos valores da contribuição sindical não
        posso incluí-la no cálculo, mas fique atento, ela custa de 1 dia de
        trabalho até 12% do seu salário
      </h4>
      <h4 className="text-xs mb-4">
        Não fiz um CLT vs PJ porque matematicamente o salário PJ sempre será
        maior que o CLT
      </h4>
      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Salário PJ:</span>
          <input
            type="text"
            value={bossCost}
            onChange={handleInputChange}
            className="border rounded-md p-2 w-full"
          />
        </label>
      </div>
      <h2 className="block text-gray-700">Salário:</h2>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <ul className="rounded-lg flex flex-col gap-1">
          <li className="text-sm">
            Salário Líquido CLT:{" "}
            <span className="font-bold">
              R$ {netSalary && netSalary.toFixed(2)}
            </span>
          </li>
          <li className="text-sm">
            Salário Bruto CLT:{" "}
            <span className="font-bold">
              R$ {grossSalary && grossSalary.toFixed(2)}
            </span>
          </li>
          <li className="text-sm">
            Desconto do FGTS:{" "}
            <span className="font-bold">R$ {FGTS && FGTS.toFixed(2)}</span>
          </li>
          <li className="text-sm">
            Desconto do INSS:{" "}
            <span className="font-bold">R$ {INSS && INSS.toFixed(2)}</span>
          </li>
          <li className="text-sm">
            Desconto do IR:{" "}
            <span className="font-bold">R$ {IR && IR.toFixed(2)}</span>
          </li>
          <li className="text-sm">
            Desconto do INSS Patronal:{" "}
            <span className="font-bold">
              R$ {INSSPatronal && INSSPatronal.toFixed(2)}
            </span>
          </li>
          <li className="text-sm">
            Custo do seu décimo terceiro:{" "}
            <span className="font-bold">
              R$ {thirteenSalary && thirteenSalary.toFixed(2)}
            </span>
          </li>
          <li className="text-sm">
            Custo das suas férias:{" "}
            <span className="font-bold">
              R$ {vacations && vacations.toFixed(2)}
            </span>
          </li>
          <li className="text-sm">
            Custo do Patrão na CLT:{" "}
            <span className="font-bold">
              R$ {bossCost && parseFloat(bossCost).toFixed(2)}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PJSalaryComparative;
