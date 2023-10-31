import React, { useState } from 'react';

const PJSalaryComparative = () => {
    const [grossSalary, setGrossSalary] = useState<number | null>();
    const [netSalary, setNetSalary] = useState<number | null>();
    const [FGTS, setFGTS] = useState<number | null>();
    const [INSS, setINSS] = useState<number | null>();
    const [IR, setIR] = useState<number | null>();
    const [INSSPatronal, setINSSPatronal] = useState<number | null>();
    const [bossCost, setBossCost] = useState<number | null>();
    const [thirteenSalary, setThirteenSalary] = useState<number | null>(0);
    const [vacations, setVacations] = useState<number | null>(0);
 

  const getINSSDetails = (gross: number): { INSSaliquot: number; INSSDeduction: number; } => {
    if (gross <= 1320.00) return { INSSaliquot: 0.075, INSSDeduction: 0 };
    if (gross <= 2571.29) return { INSSaliquot: 0.09, INSSDeduction: 19.80 };
    if (gross <= 3856.94) return { INSSaliquot: 0.12, INSSDeduction: 96.94 };
    if (gross <= 7507.49) return { INSSaliquot: 0.14, INSSDeduction: 174.08 };
    throw new Error('Salário bruto fora do intervalo válido');
  };

  const getIRDetails = (gross: number, INSSvalue: number) => {
    const base = gross - INSSvalue;
    if (base <= 2112.00) return { IRaliquot: 0.00, IRDeduction: 0 };
    if (base <= 2826.65) return { IRaliquot: 0.075, IRDeduction: 158.40 };
    if (base <= 3751.06) return { IRaliquot: 0.15, IRDeduction: 370.40 };
    if (base <= 4664.68) return { IRaliquot: 0.225, IRDeduction: 651.73 };
    return { IRaliquot: 0.275, IRDeduction: 884.96 };
  };
  
  const calculateCLTsalary = (): void => {
    if (bossCost=== null || typeof bossCost !== 'number') return;

    let gross;
    gross = bossCost/(1+0.2+2/11)
    let INSSvalue = 0;

    if (gross > 7507.49) {
        const { INSSaliquot, INSSDeduction } = getINSSDetails(7507.49);
        INSSvalue = 7507.49 * INSSaliquot - INSSDeduction;
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
    setINSSPatronal(gross*0.2);
    setThirteenSalary(gross / 11);
    setVacations(gross / 11);
    setGrossSalary(gross*1.2)
}

return (
  <>
  <h1 className="text-2xl font-bold mb-4 text-center">Calculadora de Salário PJ para CLT</h1>
  <h4 className="text-lg mb-4">Por conta das divergências dos valores da contribuição sindical não posso incluí-la no cálculo, mas fique atento, ela custa de 1 dia de trabalho até 12% do seu salário</h4>
  <form onSubmit={(e) => { e.preventDefault(); calculateCLTsalary(); }} className="space-y-4">
    <label className="block">
      <span className="text-gray-700">Salário PJ:</span>
      <input type="number" value={bossCost || ''} onChange={e => setBossCost(Number(e.target.value))} className="border rounded-md p-2 w-full" />
    </label>
    <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Calcular</button>
  </form>
  {netSalary !== null && (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <p>Salário Líquido: R$ {netSalary && netSalary.toFixed(2)}</p>
      <p>Salário Bruto: R$ {grossSalary && grossSalary.toFixed(2)}</p>
      <p>Desconto do FGTS: {FGTS && FGTS.toFixed(2)}</p>
      <p>Desconto do INSS: {INSS && INSS.toFixed(2)}</p>
      <p>Desconto do IR: {IR && IR.toFixed(2)}</p>
      <p>Desconto do INSS Patronal: {INSSPatronal && INSSPatronal.toFixed(2)}</p>
      <p>Custo do seu décimo terceiro: {thirteenSalary && thirteenSalary.toFixed(2)}</p>
      <p>Custo das suas férias:  {vacations && vacations.toFixed(2)}</p>
      <p>O seu custo para o patrão é: {bossCost && bossCost.toFixed(2)}</p>
    </div>
  )}
</>
);
};

export default PJSalaryComparative;