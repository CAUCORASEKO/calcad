import customtkinter as ctk

from translations import t
from utils import parse_float, create_input, set_steps


class IndexesModule(ctk.CTkFrame):
    def __init__(self, parent, lang):
        super().__init__(parent, fg_color="transparent")
        self.lang = lang
        self.build()

    def build(self):
        ctk.CTkLabel(
            self,
            text=t(self.lang, "nav_indexes"),
            font=("Arial", 26, "bold"),
        ).pack(anchor="w", pady=(0, 12))

        if self.lang == "FI":
            formula_text = (
                "KÄYTETTÄVÄ KAAVA\n\n"
                "Muutos % = (uusi arvo − vanha arvo) / vanha arvo × 100\n\n"
                "Vanha arvo = alkuperäinen arvo\n"
                "Uusi arvo = muuttunut arvo"
            )
        else:
            formula_text = (
                "FÓRMULA UTILIZADA\n\n"
                "Cambio % = (valor nuevo − valor antiguo) / valor antiguo × 100\n\n"
                "Valor antiguo = valor inicial\n"
                "Valor nuevo = valor después del cambio"
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

        self.old_entry = create_input(self, t(self.lang, "old_value"))
        self.new_entry = create_input(self, t(self.lang, "new_value"))

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

        self.steps_box = ctk.CTkTextbox(self, height=260)
        self.steps_box.pack(fill="both", expand=True, pady=8)
        self.steps_box.configure(state="disabled")

    def fill_example(self):
        self.clear()
        self.old_entry.insert(0, "100")
        self.new_entry.insert(0, "120")
        self.calculate()

    def clear(self):
        for entry in [self.old_entry, self.new_entry]:
            entry.delete(0, "end")

        self.result_label.configure(text="—")
        set_steps(self.steps_box, "")

    def calculate(self):
        try:
            old = parse_float(self.old_entry.get(), "old")
            new = parse_float(self.new_entry.get(), "new")

            if old == 0:
                raise ZeroDivisionError

            absolute = new - old
            percent = absolute / old * 100

            self.result_label.configure(
                text=f"{t(self.lang, 'percentage_change')}: {percent:.2f} %"
            )

            if self.lang == "FI":
                steps = f"""
1. Lasketaan absoluuttinen muutos

Muutos = uusi arvo − vanha arvo
Muutos = {new:.2f} − {old:.2f}
Muutos = {absolute:.2f}

2. Lasketaan prosenttimuutos

Muutos % = (uusi arvo − vanha arvo) / vanha arvo × 100

Muutos % = ({new:.2f} − {old:.2f}) / {old:.2f} × 100

Muutos % = {percent:.2f} %
"""
            else:
                steps = f"""
1. Calculamos el cambio absoluto

Cambio = valor nuevo − valor antiguo
Cambio = {new:.2f} − {old:.2f}
Cambio = {absolute:.2f}

2. Calculamos el cambio porcentual

Cambio % = (valor nuevo − valor antiguo) / valor antiguo × 100

Cambio % = ({new:.2f} − {old:.2f}) / {old:.2f} × 100

Cambio % = {percent:.2f} %
"""

            set_steps(self.steps_box, steps.strip())

        except ZeroDivisionError:
            self.result_label.configure(
                text=t(self.lang, "division_by_zero")
            )
        except Exception:
            self.result_label.configure(
                text=t(self.lang, "invalid_input")
            )
