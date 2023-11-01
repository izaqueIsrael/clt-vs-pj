document.addEventListener("DOMContentLoaded", function () {
    const initialState = {
      voucherValue: 0,
      voucher: 0,
      grossSalary: null,
      netSalary: null,
      FGTS: null,
      INSS: null,
      IR: null,
      INSSPatronal: null,
      bossCost: null,
      thirteenSalary: 0,
      vacations: 0,
    };
  
    const getINSSDetails = (net) => {
      if (net <= 1221.00) return { INSSaliquot: 0.075, INSSDeduction: 0 };
      if (net <= 2341.10) return { INSSaliquot: 0.09, INSSDeduction: 19.80 };
      if (net <= 3029.23) return { INSSaliquot: 0.12, INSSDeduction: 96.94 };
      if (net <= 5091.49) return { INSSaliquot: 0.14, INSSDeduction: 174.08 };
      throw new Error("Salário bruto fora do intervalo válido");
    };
  
    const getIRDetails = (net) => {
      if (net <= 1941.72) return { IRaliquot: 0.0, IRDeduction: 0 };
      if (net <= 2548.96) return { IRaliquot: 0.075, IRDeduction: 158.40 };
      if (net <= 3258.59) return { IRaliquot: 0.15, IRDeduction: 370.40 };
      if (net <= 3895.65) return { IRaliquot: 0.225, IRDeduction: 651.73 };
      return { IRaliquot: 0.275, IRDeduction: 884.96 };
    };
  
    const voucherPercent = (voucherValueToConvert) => {
      if (typeof voucherValueToConvert === "number") {
        return voucherValueToConvert / 100;
      }
      return 0;
    };
  
    const calculateGrossSalary = () => {
      if (initialState.netSalary === null || typeof initialState.netSalary !== "number") return;
      const voucherAliquot = voucherPercent(initialState.voucherValue);
      const { IRaliquot, IRDeduction } = getIRDetails(initialState.netSalary);
      let INSS;
      let gross = 0;
      if (initialState.netSalary <= 5091.49) {
        const { INSSaliquot, INSSDeduction } = getINSSDetails(initialState.netSalary);
        gross =
          (initialState.netSalary - INSSDeduction + INSSDeduction * IRaliquot - IRDeduction) /
          (1 - 0.08 - INSSaliquot - IRaliquot + INSSaliquot * IRaliquot + voucherAliquot * IRaliquot - voucherAliquot);
        INSS = gross * INSSaliquot - INSSDeduction;
      }
      if (initialState.netSalary > 5091.49) {
        gross = (initialState.netSalary + 876.97 - 876.97 * IRaliquot - IRDeduction) /
          (1 - 0.08 - IRaliquot + voucherAliquot * IRaliquot - voucherAliquot);
        INSS = 876.97;
      }
      initialState.voucher = gross * voucherAliquot;
      initialState.INSS = INSS;
      initialState.grossSalary = gross;
      initialState.FGTS = gross * 0.08;
      initialState.IR = ((gross - (INSS || 0) - (gross * voucherAliquot)) * IRaliquot) - IRDeduction;
      initialState.INSSPatronal = gross * 0.2;
      initialState.thirteenSalary = gross / 11;
      initialState.vacations = gross / 11;
      initialState.bossCost = gross * 1.2 + (gross * 2) / 11;
    };
  
    const netSalaryInput = document.querySelector("#net-salary");
    const voucherValueInput = document.querySelector("#voucher-value");
  
    netSalaryInput.addEventListener("input", function (e) {
      initialState.netSalary = Number(e.target.value);
      calculateGrossSalary();
      updateUI();
    });
  
    voucherValueInput.addEventListener("input", function (e) {
      initialState.voucherValue = Number(e.target.value);
      calculateGrossSalary();
      updateUI();
    });
  
    const updateUI = () => {

      if (initialState.grossSalary !== null) {
        const grossSalaryValue = document.querySelector("#gross");
        const fgtsValue = document.querySelector("#fgts");
        const inssValue = document.querySelector("#inss");
        const IRValue = document.querySelector("#ir");
        const inssPatronalValue = document.querySelector("#inssPatronal");
        const decimoTerceiroValue = document.querySelector("#decimoTerceiro");
        const bossCostValue = document.querySelector("#bossCost");
        const vacationsValue = document.querySelector("#vacations");
        const theVoucherValue = document.querySelector("#theVoucherValue");
    
        grossSalaryValue.textContent= `R$ ${initialState.grossSalary.toFixed(2)}`;
        fgtsValue.textContent= `R$ ${initialState.FGTS.toFixed(2)}`;
        inssValue.textContent = `R$ ${initialState.INSS.toFixed(2)}`;
        IRValue.textContent = `R$ ${initialState.IR.toFixed(2)}`;
        inssPatronalValue.textContent = `R$ ${initialState.INSSPatronal.toFixed(2)}`;
        decimoTerceiroValue.textContent = `R$ ${initialState.thirteenSalary.toFixed(2)}`;
        vacationsValue.textContent = `R$ ${initialState.vacations.toFixed(2)}`;
        bossCostValue.textContent = `R$ ${initialState.bossCost.toFixed(2)}`;
        theVoucherValue.textContent = `R$ ${initialState.voucher.toFixed(2)}`;
      } else {
        grossSalaryValue.textContent= `0`;
        fgtsValue.textContent= `0`;
        inssValue.textContent = `0`;
        IRValue.textContent = `0`;
        inssPatronalValue.textContent = `0`;
        decimoTerceiroValue.textContent =`0`;
        vacationsValue.textContent = `0`;
        bossCostValue.textContent = `0`;
        theVoucherValue= `0`;
      }
    };
  });
  