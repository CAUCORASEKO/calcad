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
    factor: "Factor a", time: "Time t", systems: "Systems of equations", advanced: "Advanced", simpleMode: "Favorable / total", dieOne: "One die", diceTwo: "Two dice", customDice: "Custom dice", probabilityKind: "Question", target: "Target", sideCount: "Sides", secondSideCount: "Second die sides", comparison: "Comparison", equal: "Equal to", greater: "Greater than", less: "Less than", greaterEqual: "Greater than or equal to", lessEqual: "Less than or equal to", atLeast: "At least", divisible: "Divisible / integer quotient", value: "Value", sum: "Sum", product: "Product", atLeastOne: "At least one die equals", totalOutcomes: "Total outcomes", favorableOutcomes: "Favorable outcomes", favorablePairs: "Favorable pairs", unique: "Unique solution", none: "No solution", infinite: "Infinitely many solutions", targetValue: "Target value", solveValue: "Evaluate f(t)", solveTime: "Solve for t", hypotenuse: "Hypotenuse", angle: "Angle (degrees)", slope: "Slope / rise:run", quotient: "Integer quotient",
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
    time: "Tiempo t", systems: "Sistemas de ecuaciones", advanced: "Avanzada", simpleMode: "Favorables / totales", dieOne: "Un dado", diceTwo: "Dos dados", customDice: "Dados personalizados", probabilityKind: "Pregunta", target: "Objetivo", sideCount: "Caras", secondSideCount: "Caras del segundo dado", comparison: "Comparación", equal: "Igual a", greater: "Mayor que", less: "Menor que", greaterEqual: "Mayor o igual que", lessEqual: "Menor o igual que", atLeast: "Al menos", divisible: "Divisible / cociente entero", value: "Valor", sum: "Suma", product: "Producto", atLeastOne: "Al menos un dado es igual a", totalOutcomes: "Resultados totales", favorableOutcomes: "Resultados favorables", favorablePairs: "Parejas favorables", unique: "Solución única", none: "Sin solución", infinite: "Infinitas soluciones", targetValue: "Valor objetivo", solveValue: "Evaluar t", solveTime: "Despejar t", hypotenuse: "Hipotenusa", angle: "Ángulo (grados)", slope: "Pendiente", quotient: "Cociente entero",
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
    time: "Aika t", systems: "Yhtälöparit", advanced: "Edistynyt", simpleMode: "Suotuisat / kaikki", dieOne: "Yksi noppa", diceTwo: "Kaksi noppaa", customDice: "Omat nopat", probabilityKind: "Kysymys", target: "Tavoite", sideCount: "Sivut", secondSideCount: "Toisen nopan sivut", comparison: "Vertailu", equal: "Yhtä kuin", greater: "Suurempi kuin", less: "Pienempi kuin", greaterEqual: "Suurempi tai yhtä suuri kuin", lessEqual: "Pienempi tai yhtä suuri kuin", atLeast: "Vähintään", divisible: "Jaollisuus / kokonaislukusuhde", value: "Arvo", sum: "Summa", product: "Tulo", atLeastOne: "Vähintään yksi noppa on", totalOutcomes: "Kaikki tulokset", favorableOutcomes: "Suotuisat tulokset", favorablePairs: "Suotuisat parit", unique: "Yksi ratkaisu", none: "Ei ratkaisua", infinite: "Äärettömän monta ratkaisua", targetValue: "Tavoitearvo", solveValue: "Laske f(t)", solveTime: "Ratkaise t", hypotenuse: "Hypotenuusa", angle: "Kulma (astetta)", slope: "Nousu:vaakamatka", quotient: "Kokonaislukusuhde",
  },
};

function tr(lang, key) {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.ES[key] ?? key;
}

Object.assign(TRANSLATIONS.EN, {navVat:"VAT", indexedValue:"Indexed value", base100:"Base-100 series", unitEconomics:"Unit economics", quantity:"Quantity", price:"Selling price per unit", variableUnit:"Variable cost per unit", fixed:"Fixed costs", mode:"Mode", netToGross:"Net to gross", grossToNet:"Gross to net", amount:"Amount", rate:"VAT rate %", startCapital:"Starting capital", taxRate:"Annual tax %", growthYears:"Number of years", taxedGrowth:"Growth with tax", indexedSeries:"Values (2–6)", oldIndex:"Old index", newIndex:"New index", less:"Less than", greaterEqual:"Greater than or equal to", lessEqual:"Less than or equal to"});
Object.assign(TRANSLATIONS.ES, {navVat:"IVA", indexedValue:"Valor indexado", base100:"Serie base 100", unitEconomics:"Economía unitaria", quantity:"Cantidad", price:"Precio de venta por unidad", variableUnit:"Coste variable por unidad", fixed:"Costes fijos", mode:"Modo", netToGross:"Neto a bruto", grossToNet:"Bruto a neto", amount:"Importe", rate:"% de IVA", startCapital:"Capital inicial", taxRate:"% de impuesto anual", growthYears:"Número de años", taxedGrowth:"Crecimiento con impuesto", indexedSeries:"Valores (2–6)", oldIndex:"Índice antiguo", newIndex:"Índice nuevo", less:"Menor que", greaterEqual:"Mayor o igual que", lessEqual:"Menor o igual que"});
Object.assign(TRANSLATIONS.FI, {navVat:"ALV", indexedValue:"Indeksoitu arvo", base100:"Perusindeksisarja", unitEconomics:"Yksikkötalous", quantity:"Määrä", price:"Myyntihinta yksiköltä", variableUnit:"Muuttuva kustannus yksiköltä", fixed:"Kiinteät kustannukset", mode:"Tila", netToGross:"Netosta brutoksi", grossToNet:"Brutosta netoksi", amount:"Summa", rate:"ALV-prosentti", startCapital:"Alkupääoma", taxRate:"Vuosittainen vero-%", growthYears:"Vuosien määrä", taxedGrowth:"Verotettu kasvu", indexedSeries:"Arvot (2–6)", oldIndex:"Vanha indeksi", newIndex:"Uusi indeksi", less:"Pienempi kuin", greaterEqual:"Suurempi tai yhtä suuri kuin", lessEqual:"Pienempi tai yhtä suuri kuin"});


Object.assign(TRANSLATIONS.EN, {
  directValues: "Direct values",
  percentageChange: "Percentage change",
  exponentialStandard: "Exponential calculation",
});

Object.assign(TRANSLATIONS.ES, {
  directValues: "Valores directos",
  percentageChange: "Cambio porcentual",
  exponentialStandard: "Cálculo exponencial",
});

Object.assign(TRANSLATIONS.FI, {
  directValues: "Suorat arvot",
  percentageChange: "Prosenttimuutos",
  exponentialStandard: "Eksponenttilaskenta",
});

const PHASE3={EN:{navFunctions:"Functions & Charts",linearFunction:"Linear function",piecewiseFunction:"Piecewise function",dataChart:"Data chart",pieChart:"Pie chart",loanChart:"Loan chart",intercept:"Intercept",xStart:"X start",xEnd:"X end",step:"Step",evaluateX:"Evaluate x",valueTable:"Value table",table:"Table",baseRate:"Base rate",breakpoint:"Breakpoint",multiplier:"Multiplier",labels:"Labels / categories",values:"Values",chartType:"Chart type",lineChart:"Line chart",barChart:"Bar chart",statistics:"Statistics",total:"Total",mean:"Mean",minimum:"Minimum",maximum:"Maximum",range:"Range",largest:"Largest",valuesToPercentages:"Values to percentages",percentagesToValues:"Percentages to values",totalAmount:"Total amount",loanType:"Loan type",remainingBalance:"Remaining balance",payment:"Payment",interestComponent:"Interest",principalComponent:"Principal / amortization"},ES:{navFunctions:"Funciones y gráficos",linearFunction:"Función lineal",piecewiseFunction:"Función por tramos",dataChart:"Gráfico de datos",pieChart:"Gráfico circular",loanChart:"Gráfico del préstamo",intercept:"Intersección con eje y",xStart:"Inicio de x",xEnd:"Fin de x",step:"Paso",evaluateX:"Calcular x",valueTable:"Tabla de valores",table:"Tabla",baseRate:"Tarifa base",breakpoint:"Punto de corte",multiplier:"Multiplicador",labels:"Etiquetas / categorías",values:"Valores",chartType:"Tipo de gráfico",lineChart:"Gráfico lineal",barChart:"Gráfico de barras",statistics:"Estadísticas",total:"Total",mean:"Media",minimum:"Mínimo",maximum:"Máximo",range:"Rango",largest:"Mayor",valuesToPercentages:"Valores a porcentajes",percentagesToValues:"Porcentajes a valores",totalAmount:"Importe total",loanType:"Tipo de préstamo",remainingBalance:"Saldo restante",payment:"Cuota",interestComponent:"Interés",principalComponent:"Capital / amortización"},FI:{navFunctions:"Funktiot ja kuvaajat",linearFunction:"Lineaarinen funktio",piecewiseFunction:"Paloittainen funktio",dataChart:"Datakuvaaja",pieChart:"Ympyrädiagrammi",loanChart:"Lainakaavio",intercept:"Vakiotermi",xStart:"X:n alku",xEnd:"X:n loppu",step:"Askel",evaluateX:"Laske x",valueTable:"Arvotaulukko",table:"Taulukko",baseRate:"Peruskorvaus",breakpoint:"Raja-arvo",multiplier:"Kerroin",labels:"Tunnisteet / kategoriat",values:"Arvot",chartType:"Kaaviotyyppi",lineChart:"Viivakaavio",barChart:"Pylväskaavio",statistics:"Tilastot",total:"Summa",mean:"Keskiarvo",minimum:"Pienin",maximum:"Suurin",range:"Vaihteluväli",largest:"Suurin",valuesToPercentages:"Arvoista prosenteiksi",percentagesToValues:"Prosenteista arvoiksi",totalAmount:"Kokonaissumma",loanType:"Lainatyyppi",remainingBalance:"Jäljellä oleva saldo",payment:"Maksu",interestComponent:"Korko",principalComponent:"Pääoma / lyhennys"}};
Object.keys(PHASE3).forEach((lang)=>Object.assign(TRANSLATIONS[lang],PHASE3[lang]));


Object.assign(TRANSLATIONS.EN, {
  increasing: "Increasing",
  decreasing: "Decreasing",
  constantFunction: "Constant",
  functionBehavior: "Behavior",
  rateAfterBreakpoint: "Rate after breakpoint",
  count: "Number of values",
  firstToLastChange: "Change from first to last",
  notAvailable: "Not available",
  smallest: "Smallest",
  chartMetric: "Chart value",
});

Object.assign(TRANSLATIONS.ES, {
  increasing: "Creciente",
  decreasing: "Decreciente",
  constantFunction: "Constante",
  functionBehavior: "Comportamiento",
  rateAfterBreakpoint: "Tarifa después del punto de corte",
  count: "Número de valores",
  firstToLastChange: "Cambio del primero al último",
  notAvailable: "No disponible",
  smallest: "Menor",
  chartMetric: "Valor del gráfico",
});

Object.assign(TRANSLATIONS.FI, {
  increasing: "Kasvava",
  decreasing: "Vähenevä",
  constantFunction: "Vakio",
  functionBehavior: "Käyttäytyminen",
  rateAfterBreakpoint: "Rajan jälkeinen korvaus",
  count: "Arvojen määrä",
  firstToLastChange: "Muutos ensimmäisestä viimeiseen",
  notAvailable: "Ei saatavilla",
  smallest: "Pienin",
  chartMetric: "Kaavion arvo",
});
