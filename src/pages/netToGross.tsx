import React, { useState, useEffect } from 'react';

const NetToGross = () => {
  const [voucherValue, setVoucherValue] = useState<number | null>(0);
  const [voucher, setVoucher] = useState<number | null>(0);
  const [grossSalary, setGrossSalary] = useState<number | null>();
  const [netSalary, setNetSalary] = useState<number | null>();
  const [FGTS, setFGTS] = useState<number | null>();
  const [INSS, setINSS] = useState<number | null>();
  const [IR, setIR] = useState<number | null>();
  const [INSSPatronal, setINSSPatronal] = useState<number | null>();
  const [bossCost, setBossCost] = useState<number | null>();
  const [thirteenSalary, setThirteenSalary] = useState<number | null>(0);
  const [vacations, setVacations] = useState<number | null>(0);

  const getINSSDetails = (net: number): { INSSaliquot: number; INSSDeduction: number; } => {
    if (net <= 1221.00) return { INSSaliquot: 0.075, INSSDeduction: 0 };
    if (net <= 2341.10) return { INSSaliquot: 0.09, INSSDeduction: 19.80 };
    if (net <= 3029.23) return { INSSaliquot: 0.12, INSSDeduction: 96.94 };
    if (net <= 5091.49) return { INSSaliquot: 0.14, INSSDeduction: 174.08 };
    throw new Error('Salário bruto fora do intervalo válido');
  };
  
  const getIRDetails = (net: number) => {
    if (net <= 1941.72) return { IRaliquot: 0.00, IRDeduction: 0 };
    if (net <= 2548.96) return { IRaliquot: 0.075, IRDeduction: 158.40 };
    if (net <= 3258.59) return { IRaliquot: 0.15, IRDeduction: 370.40 };
    if (net <= 3895.65) return { IRaliquot: 0.225, IRDeduction: 651.73 };
    return { IRaliquot: 0.275, IRDeduction: 884.96 };
  };

  const voucherPercent = (voucherValueToConvert : any) : number => {
    if(typeof voucherValueToConvert === 'number'){
      return voucherValueToConvert/100;
    }      
    return 0;                                                                                                                                                                                                                                                                                                                                                  
  }
  
  useEffect(() => {
    const calculateGrossSalary = () => {
      if (netSalary === null || typeof netSalary !== 'number') return;
      const voucherAliquot: number | null = voucherPercent(voucherValue);
      const { IRaliquot, IRDeduction } = getIRDetails(netSalary);
      let INSS;
      let gross = 0;
      if (netSalary <= 5091.49) {
        const { INSSaliquot, INSSDeduction } = getINSSDetails(netSalary);
        gross = (netSalary - INSSDeduction + INSSDeduction * IRaliquot - IRDeduction) / (1 - 0.08 - INSSaliquot - IRaliquot + INSSaliquot * IRaliquot + voucherAliquot * IRaliquot - voucherAliquot);
        INSS = (gross * INSSaliquot - INSSDeduction);
      } 
      if (netSalary > 5091.49) {
        gross = (netSalary + 876.97 - 876.97 * IRaliquot - IRDeduction) / (1 - 0.08 - IRaliquot + voucherAliquot * IRaliquot - voucherAliquot);
        INSS = 876.97;
      }
      setVoucher(gross*voucherAliquot);
      setINSS(INSS);
      setGrossSalary(gross);
      setFGTS(gross * 0.08);
      setIR(((gross - (INSS || 0) - (gross*voucherAliquot)) * IRaliquot) - IRDeduction);
      setINSSPatronal(gross * 0.2);
      setThirteenSalary(gross / 11);
      setVacations(gross / 11);
      setBossCost(gross * 1.2 + gross * 2 / 11);
    };
    calculateGrossSalary();
  }, [netSalary, voucherValue]);

return (
<>
  <div className="flex justify-center items-center h-screen">
    <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Calculadora de Salário Bruto</h1>
      <form className="bg-white p-6 rounded-md shadow-md flex flex-col">
        <h4 className="text-lg mb-4">Por conta das divergências dos valores da contribuição sindical não posso incluí-la no cálculo, mas fique atento, ela custa de 1 dia de trabalho até 12% do seu salário</h4>
        
        <label className="mb-2">
          Salário Líquido:
          <input type="number" value={netSalary || ''} onChange={e => setNetSalary(Number(e.target.value))} className="border rounded-md p-2" />
        </label>
        
        <label className="mb-2">
          Porcentagem dos seus vales em relação ao seu salário bruto:
          <input type="number" value={voucherValue || ''} onChange={e => setVoucherValue(Number(e.target.value))} className="border rounded-md p-2" />
        </label>
        
      </form>

      {grossSalary !== null && (
        <div className="mt-4">
          <p>Salário Bruto: R$ {grossSalary && grossSalary.toFixed(2)}</p>
          <p>Desconto do FGTS: {FGTS && FGTS.toFixed(2)}</p>
          <p>Desconto do INSS: {INSS && INSS.toFixed(2)}</p>
          <p>Desconto do IR: {IR && IR.toFixed(2)}</p>
          <p>Valor dos seus vouchers:  {voucher && voucher.toFixed(2)}</p>
          <p>Desconto do INSS Patronal: {INSSPatronal && INSSPatronal.toFixed(2)}</p>
          <p>Custo do seu décimo terceiro: {thirteenSalary && thirteenSalary.toFixed(2)}</p>
          <p>Custo das suas férias:  {vacations && vacations.toFixed(2)}</p>
          <p>O seu custo para o patrão é: {bossCost && bossCost.toFixed(2)}</p>
        </div>
      )}
    </div>
  </div>

</>

);
};

export default NetToGross;