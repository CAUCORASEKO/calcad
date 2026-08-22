const TRANSLATIONS = {
  EN: {
    appTitle: "CalcAd", language: "Language",
    navLoans: "Loans", navContribution: "Contribution Margin", navIndexes: "Indexes",
    navInflation: "Inflation", navProbability: "Probability", navEquations: "Equations",
    navTrigonometry: "Trigonometry", navExponential: "Exponential Functions",
    calculate: "Calculate", example: "Example", clear: "Clear", result: "Result",
    steps: "Step-by-step solution", formulas: "Formulas used", formula: "Formula used",
    invalidInput: "Check the entered values.", constantLoan: "Constant Amortization Loan",
    annuityLoan: "Annuity Loan", capital: "Initial capital K", months: "Number of months n",
    annualInterest: "Annual interest %", installmentNumber: "Installment or month to calculate",
    sales: "Sales revenue", variableCosts: "Variable costs", fixedCosts: "Fixed costs",
    oldValue: "Old value", newValue: "New value", cpiInitial: "CPI1 / Initial index",
    cpiFinal: "CPI2 / Final index", years: "Number of years", favorableCases: "Favorable cases",
    totalCases: "Total cases", linearEquation: "Linear Equation", quadraticEquation: "Quadratic Equation",
    opposite: "Opposite Side", adjacent: "Adjacent Side", initialValue: "Initial value k",
    factor: "Factor a", time: "Time t",
  },
  ES: {
    appTitle: "CalcAd",
    language: "Idioma",

    navLoans: "Préstamos",
    navContribution: "Margen de contribución",
    navIndexes: "Índices",
    navInflation: "Inflación",
    navProbability: "Probabilidad",
    navEquations: "Ecuaciones",
    navTrigonometry: "Trigonometría",
    navExponential: "Funciones exponenciales",

    calculate: "Calcular",
    example: "Ejemplo",
    clear: "Limpiar",
    result: "Resultado",
    steps: "Desglose paso a paso",
    formulas: "Fórmulas utilizadas",
    formula: "Fórmula utilizada",
    invalidInput: "Revisa los valores ingresados.",

    constantLoan: "Préstamo con amortización constante",
    annuityLoan: "Préstamo con cuota fija",

    capital: "Capital inicial K",
    months: "Número de meses n",
    annualInterest: "Interés anual %",
    installmentNumber: "Cuota o mes que quieres calcular",

    sales: "Ingresos por ventas",
    variableCosts: "Costes variables",
    fixedCosts: "Costes fijos",

    oldValue: "Valor antiguo",
    newValue: "Valor nuevo",

    cpiInitial: "IPC1 / Índice inicial",
    cpiFinal: "IPC2 / Índice final",
    years: "Número de años",

    favorableCases: "Casos favorables",
    totalCases: "Casos totales",

    linearEquation: "Ecuación lineal",
    quadraticEquation: "Ecuación cuadrática",

    opposite: "Cateto opuesto",
    adjacent: "Cateto adyacente",

    initialValue: "Valor inicial k",
    factor: "Factor a",
    time: "Tiempo t",
  },

  FI: {
    appTitle: "CalcAd",
    language: "Kieli",

    navLoans: "Lainat",
    navContribution: "Katetuottolaskelma",
    navIndexes: "Indeksit",
    navInflation: "Inflaatio",
    navProbability: "Todennäköisyys",
    navEquations: "Yhtälöt",
    navTrigonometry: "Trigonometria",
    navExponential: "Eksponenttifunktiot",

    calculate: "Laske",
    example: "Esimerkki",
    clear: "Tyhjennä",
    result: "Tulos",
    steps: "Vaiheittainen ratkaisu",
    formulas: "Käytettävät kaavat",
    formula: "Käytettävä kaava",
    invalidInput: "Tarkista syötetyt arvot.",

    constantLoan: "Tasalyhennyslaina",
    annuityLoan: "Annuiteettilaina",

    capital: "Pääoma K",
    months: "Kuukausien määrä n",
    annualInterest: "Vuosikorko %",
    installmentNumber: "Laskettava erä / kuukausi",

    sales: "Myyntituotot",
    variableCosts: "Muuttuvat kustannukset",
    fixedCosts: "Kiinteät kustannukset",

    oldValue: "Vanha arvo",
    newValue: "Uusi arvo",

    cpiInitial: "KHI1 / Alkuindeksi",
    cpiFinal: "KHI2 / Loppuindeksi",
    years: "Vuosien määrä",

    favorableCases: "Suotuisat tapaukset",
    totalCases: "Kaikki tapaukset",

    linearEquation: "Lineaarinen yhtälö",
    quadraticEquation: "Toisen asteen yhtälö",

    opposite: "Vastakkainen kateetti",
    adjacent: "Viereinen kateetti",

    initialValue: "Alkuarvo k",
    factor: "Kerroin a",
    time: "Aika t",
  },
};

function tr(lang, key) {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.ES[key] ?? key;
}
