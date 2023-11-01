document.addEventListener("DOMContentLoaded", function () {
    const initialState = {
      grossSalary: null,
      netSalary: null,
      FGTS: null,
      INSS: null,
      IR: null,
      INSSPatronal: null,
      bossCost: null,
    };
  
    const getINSSDetails = (gross) => {
      if (gross <= 1320.00) return { INSSaliquot: 0.075, INSSDeduction: 0 };
      if (gross <= 2571.29) return { INSSaliquot: 0.09, INSSDeduction: 19.80 };
      if (gross <= 3856.94) return { INSSaliquot: 0.12, INSSDeduction: 96.94 };
      if (gross <= 7507.49) return { INSSaliquot: 0.14, INSSDeduction: 174.08 };
      throw new Error("Salário bruto fora do intervalo válido");
    };
  
    const getIRDetails = (gross, INSSvalue) => {
      const base = gross - INSSvalue;
      if (base <= 2112.00) return { IRaliquot: 0.0, IRDeduction: 0 };
      if (base <= 2826.65) return { IRaliquot: 0.075, IRDeduction: 158.40 };
      if (base <= 3751.06) return { IRaliquot: 0.15, IRDeduction: 370.40 };
      if (base <= 4664.68) return { IRaliquot: 0.225, IRDeduction: 651.73 };
      return { IRaliquot: 0.275, IRDeduction: 884.96 };
    };
  
    const calculateNetSalary = () => {
      if (initialState.grossSalary === null || typeof initialState.grossSalary !== "number") return;
  
      let INSSvalue = 0;
      if (initialState.grossSalary > 7507.49) {
        const { INSSaliquot, INSSDeduction } = getINSSDetails(7507.49);
        INSSvalue = 7507.49 * INSSaliquot - INSSDeduction;
      } else {
        const { INSSaliquot, INSSDeduction } = getINSSDetails(initialState.grossSalary);
        INSSvalue = initialState.grossSalary * INSSaliquot - INSSDeduction;
      }
  
      const { IRaliquot, IRDeduction } = getIRDetails(initialState.grossSalary, INSSvalue);
      const IRvalue = (initialState.grossSalary - INSSvalue) * IRaliquot - IRDeduction;
  
      const FGTSvalue = initialState.grossSalary * 0.08;
  
      const netSalary = initialState.grossSalary - INSSvalue - IRvalue - FGTSvalue;
      initialState.netSalary = netSalary;
      initialState.FGTS = FGTSvalue;
      initialState.INSS = INSSvalue;
      initialState.IR = IRvalue;
      initialState.INSSPatronal = initialState.grossSalary * 0.2;
      initialState.bossCost = initialState.grossSalary * 1.2;
  
      updateUI();
    };
  
    const grossSalaryInput = document.querySelector("#gross-salary");
  
    grossSalaryInput.addEventListener("input", function (e) {
      initialState.grossSalary = Number(e.target.value);
    });
  
    const updateUI = () => {
      const netSalaryValue = document.querySelector("#net");
      const fgtsValue = document.querySelector("#fgts");
      const inssValue = document.querySelector("#inss");
      const IRValue = document.querySelector("#ir");
      const inssPatronalValue = document.querySelector("#inssPatronal");
      const bossCostValue = document.querySelector("#bossCost");
      const decimoTerceiroValue = document.querySelector("#decimoTerceiro");
      const vacationsValue = document.querySelector("#vacations");

      if (initialState.netSalary !== null) {
        netSalaryValue.textContent= `R$ ${initialState.netSalary.toFixed(2)}`;
        fgtsValue.textContent= `R$ ${initialState.FGTS.toFixed(2)}`;
        inssValue.textContent = `R$ ${initialState.INSS.toFixed(2)}`;
        IRValue.textContent = `R$ ${initialState.IR.toFixed(2)}`;
        inssPatronalValue.textContent = `R$ ${initialState.INSSPatronal.toFixed(2)}`;
        decimoTerceiroValue.textContent = `R$ ${Number(initialState.bossCost/11).toFixed(2)}`;
        vacationsValue.textContent = `R$ ${Number(initialState.bossCost/11).toFixed(2)}`;
        bossCostValue.textContent = `R$ ${Number(initialState.bossCost + initialState.bossCost*2/11).toFixed(2)}`
      } else {
        netSalaryValue.textContent= `0`;
        fgtsValue.textContent= `0`;
        inssValue.textContent = `0`;
        IRValue.textContent = `0`;
        inssPatronalValue.textContent = `0`;
        decimoTerceiroValue.textContent =`0`;
        vacationsValue.textContent = `0`;
        bossCostValue.textContent = `0`;
      }
    };
  
    const form = document.querySelector("form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      calculateNetSalary();
    });
  });
  