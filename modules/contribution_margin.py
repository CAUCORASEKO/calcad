import customtkinter as ctk

from translations import t
from utils import parse_float, create_input, set_steps


class ContributionMarginModule(ctk.CTkFrame):
    def __init__(self, parent, lang):
        super().__init__(parent, fg_color="transparent")
        self.lang = lang
        self.build()

    def build(self):
        ctk.CTkLabel(
            self,
            text=t(self.lang, "nav_contribution"),
            font=("Arial", 26, "bold"),
        ).pack(anchor="w", pady=(0, 12))

        if self.lang == "FI":
            formula_text = (
                "KÄYTETTÄVÄT KAAVAT\n\n"
                "Kate = myyntituotot − muuttuvat kustannukset\n"
                "Tulos = kate − kiinteät kustannukset\n"
                "Kateprosentti = kate / myyntituotot × 100\n\n"
                "Myyntituotot = myynnistä saadut tulot\n"
                "Muuttuvat kustannukset = myynnin määrän mukaan muuttuvat kulut\n"
                "Kiinteät kustannukset = toiminnan kiinteät kulut"
            )
        else:
            formula_text = (
                "FÓRMULAS UTILIZADAS\n\n"
                "Margen = ingresos por ventas − costes variables\n"
                "Resultado = margen − costes fijos\n"
                "Margen % = margen / ingresos por ventas × 100\n\n"
                "Ingresos por ventas = dinero obtenido por las ventas\n"
                "Costes variables = costes que cambian con el nivel de ventas\n"
                "Costes fijos = costes que permanecen fijos"
            )

        card = ctk.CTkFrame(self, corner_radius=10)
        card.pack(fill="x", pady=(10, 16))

        ctk.CTkLabel(
            card,
            text=formula_text,
            font=("Arial", 15),
            justify="left",
            anchor="w",
        ).pack(fill="x", padx=18, pady=16)

        self.sales_entry = create_input(self, t(self.lang, "sales"))
        self.variable_entry = create_input(self, t(self.lang, "variable_costs"))
        self.fixed_entry = create_input(self, t(self.lang, "fixed_costs"))

        buttons = ctk.CTkFrame(self, fg_color="transparent")
        buttons.pack(anchor="w", pady=12)

        ctk.CTkButton(
            buttons,
            text=t(self.lang, "calculate"),
            command=self.calculate,
            width=150,
        ).pack(side="left", padx=(0, 10))

        ctk.CTkButton(
            buttons,
            text=t(self.lang, "example"),
            command=self.fill_example,
            width=130,
        ).pack(side="left", padx=(0, 10))

        ctk.CTkButton(
            buttons,
            text=t(self.lang, "clear"),
            command=self.clear,
            width=130,
            fg_color="#7f8c8d",
            hover_color="#6c7a7d",
        ).pack(side="left")

        self.result_label = ctk.CTkLabel(
            self,
            text="—",
            font=("Arial", 25, "bold"),
        )
        self.result_label.pack(anchor="w", pady=8)

        self.steps_box = ctk.CTkTextbox(self, height=280)
        self.steps_box.pack(fill="both", expand=True, pady=8)
        self.steps_box.configure(state="disabled")

    def fill_example(self):
        self.clear()
        self.sales_entry.insert(0, "12000")
        self.variable_entry.insert(0, "7200")
        self.fixed_entry.insert(0, "3000")
        self.calculate()

    def clear(self):
        for entry in [
            self.sales_entry,
            self.variable_entry,
            self.fixed_entry,
        ]:
            entry.delete(0, "end")

        self.result_label.configure(text="—")
        set_steps(self.steps_box, "")

    def calculate(self):
        try:
            sales = parse_float(self.sales_entry.get(), "sales")
            variable = parse_float(self.variable_entry.get(), "variable")
            fixed = parse_float(self.fixed_entry.get(), "fixed")

            margin = sales - variable
            result = margin - fixed
            margin_percent = margin / sales * 100 if sales != 0 else 0

            self.result_label.configure(
                text=f"{t(self.lang, 'profit')}: {result:.2f} €"
            )

            if self.lang == "FI":
                steps = f"""
1. Lasketaan kate

Kate = myyntituotot − muuttuvat kustannukset
Kate = {sales:.2f} − {variable:.2f}
Kate = {margin:.2f} €

2. Lasketaan tulos

Tulos = kate − kiinteät kustannukset
Tulos = {margin:.2f} − {fixed:.2f}
Tulos = {result:.2f} €

3. Lasketaan kateprosentti

Kateprosentti = kate / myyntituotot × 100
Kateprosentti = {margin:.2f} / {sales:.2f} × 100
Kateprosentti = {margin_percent:.2f} %
"""
            else:
                steps = f"""
1. Calculamos el margen de contribución

Margen = ingresos por ventas − costes variables
Margen = {sales:.2f} − {variable:.2f}
Margen = {margin:.2f} €

2. Calculamos el resultado

Resultado = margen − costes fijos
Resultado = {margin:.2f} − {fixed:.2f}
Resultado = {result:.2f} €

3. Calculamos el porcentaje de margen

Margen % = margen / ingresos por ventas × 100
Margen % = {margin:.2f} / {sales:.2f} × 100
Margen % = {margin_percent:.2f} %
"""

            set_steps(self.steps_box, steps.strip())

        except Exception:
            self.result_label.configure(
                text=t(self.lang, "invalid_input")
            )
