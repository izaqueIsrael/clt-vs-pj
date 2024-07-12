import React, { useState, useEffect, ChangeEvent } from "react";

const NetToGross = () => {
  const [voucherValue, setVoucherValue] = useState<string>("");
  const [voucher, setVoucher] = useState<number | null>(0);
  const [grossSalary, setGrossSalary] = useState<number | null>(null);
  const [netSalary, setNetSalary] = useState<string>("");
  const [FGTS, setFGTS] = useState<number | null>(null);
  const [INSS, setINSS] = useState<number | null>(null);
  const [IR, setIR] = useState<number | null>(null);
  const [INSSPatronal, setINSSPatronal] = useState<number | null>(null);
  const [bossCost, setBossCost] = useState<number | null>(null);
  const [thirteenSalary, setThirteenSalary] = useState<number | null>(0);
  const [vacations, setVacations] = useState<number | null>(0);

  // Pega a faixa do INSS, coloca na calculadora de salário bruto 
  // e soma o líquido com o fgts
  const getINSSDetails = (
    net: number
  ): { INSSaliquot: number; INSSDeduction: number } => {
    if (net <= 1306.1) return { INSSaliquot: 0.075, INSSDeduction: 0 };
    if (net <= 2433.7) return { INSSaliquot: 0.09, INSSDeduction: 21.18};
    if (net <= 3459.46) return { INSSaliquot: 0.12, INSSDeduction: 101.18 };
    if (net <= 5881.94) return { INSSaliquot: 0.14, INSSDeduction: 181.18 };
    throw new Error("Salário bruto fora do intervalo válido");
  };

  // Pega a faixa do IR, coloca na calculadora de salário bruto 
  // e soma o líquido com o fgts
  const getIRDetails = (net: number) => {
    if (net <= 2077.06) return { IRaliquot: 0.0, IRDeduction: 0 };
    if (net <= 2563.92) return { IRaliquot: 0.075, IRDeduction: 169.44 };
    if (net <= 3273.22) return { IRaliquot: 0.15, IRDeduction: 381.44 };
    if (net <= 3912.19) return { IRaliquot: 0.225, IRDeduction: 662.77 };
    return { IRaliquot: 0.275, IRDeduction: 896.00 };
  };

  const voucherPercent = (voucherValueToConvert: number): number => {
    return voucherValueToConvert / 100;
  };

  useEffect(() => {
    const calculateGrossSalary = () => {
      const parsedNetSalary = parseFloat(netSalary);
      const parsedVoucherValue = parseFloat(voucherValue) || 0;

      if (isNaN(parsedNetSalary)) {
        setGrossSalary(null);
        setVoucher(null);
        setINSS(null);
        setFGTS(null);
        setIR(null);
        setINSSPatronal(null);
        setThirteenSalary(null);
        setVacations(null);
        setBossCost(null);
        return;
      }

      const voucherAliquot = voucherPercent(parsedVoucherValue);
      const { IRaliquot, IRDeduction } = getIRDetails(parsedNetSalary);
      let INSS;
      let gross = 0;

      if (parsedNetSalary <= 5881.94) {
        const { INSSaliquot, INSSDeduction } = getINSSDetails(parsedNetSalary);
        gross =
          (parsedNetSalary +
            IRDeduction -
            INSSDeduction +
            parsedNetSalary * voucherAliquot) /
          (1 -
            0.08 -
            INSSaliquot -
            IRaliquot +
            INSSaliquot * IRaliquot -
            voucherAliquot +
            voucherAliquot * IRaliquot);
        INSS = gross * INSSaliquot - INSSDeduction;
      } else {
        gross =
          (parsedNetSalary +
            896.00 -
            896.00 * IRaliquot -
            IRDeduction +
            parsedNetSalary * voucherAliquot) /
          (1 - 0.08 - IRaliquot - voucherAliquot + voucherAliquot * IRaliquot);
        INSS = 896.00;
      }

      setVoucher(gross * voucherAliquot);
      setINSS(INSS);
      setGrossSalary(gross);
      setFGTS(gross * 0.08);
      setIR((gross - INSS - gross * voucherAliquot) * IRaliquot - IRDeduction);
      setINSSPatronal(gross * 0.2);
      setThirteenSalary(gross / 12);
      setVacations(gross / 12);
      setBossCost(gross * 1.2 + (gross * 2) / 12);
    };

    calculateGrossSalary();
  }, [netSalary, voucherValue]);

  // Handler for input change
  const handleNetSalaryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setNetSalary(value);
    }
  };

  const handleVoucherValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setVoucherValue(value);
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 p-4 rounded-lg">
      <div className="p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Salário Líquido para Bruto</h1>
        <form className="rounded-md flex flex-col">
          <h4 className="text-xs mb-4">
            Por conta das divergências dos valores da contribuição sindical não
            posso incluí-la no cálculo, mas fique atento, ela custa de 1 dia de
            trabalho até 12% do seu salário
          </h4>
          {/* <h4 className="text-xs mb-4">
            Devido a trâmites na lei, considerare que os vouchers não possuem
            imposto, mas alguns possuem desconto de IR dependendo da modalidade e da ausência de coparticipação
          </h4> */}
          <label className="mb-2 flex flex-col">
            Salário Líquido:
            <input
              type="text"
              value={netSalary}
              onChange={handleNetSalaryChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label>

          {/* <label className="mb-2 flex flex-col">
            Porcentagem dos seus vales em relação ao seu salário bruto:
            <input
              type="text"
              value={voucherValue}
              onChange={handleVoucherValueChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </label> */}
        </form>
        <div className="mt-4 flex flex-col justify-center">
          <h2 className="block text-gray-700">Salário:</h2>
          <div className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm">
            <ul className="rounded-lg flex flex-col gap-1">
              <li className="text-sm">
                Salário Bruto:{" "}
                <span className="font-bold">
                  R$ {grossSalary && grossSalary.toFixed(2)}
                </span>
              </li>
              <li className="text-sm">
                Desconto do FGTS:{" "}
                <span className="font-bold">R$ {FGTS?.toFixed(2)}</span>
              </li>
              <li className="text-sm">
                Desconto do INSS:{" "}
                <span className="font-bold">R$ {INSS?.toFixed(2)}</span>
              </li>
              <li className="text-sm">
                Desconto do IR:{" "}
                <span className="font-bold">R$ {IR?.toFixed(2)}</span>
              </li>
              <li className="text-sm">
                Valor dos seus vouchers:{" "}
                <span className="font-bold">R$ {voucher?.toFixed(2)}</span>
              </li>
              <li className="text-sm">
                Desconto do INSS Patronal:{" "}
                <span className="font-bold">R$ {INSSPatronal?.toFixed(2)}</span>
              </li>
              <li className="text-sm">
                Custo do seu décimo terceiro:{" "}
                <span className="font-bold">
                  R$ {thirteenSalary?.toFixed(2)}
                </span>
              </li>
              <li className="text-sm">
                Custo das suas férias:{" "}
                <span className="font-bold">R$ {vacations?.toFixed(2)}</span>
              </li>
              <li className="text-sm">
                O seu custo para o patrão é:{" "}
                <span className="font-bold">R$ {bossCost?.toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetToGross;
