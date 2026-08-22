import customtkinter as ctk

from translations import t
from utils import parse_float, create_input, set_steps


class ProbabilityModule(ctk.CTkFrame):
    def __init__(self, parent, lang):
        super().__init__(parent, fg_color="transparent")
        self.lang = lang
        self.build()

    def build(self):
        ctk.CTkLabel(
            self,
            text=t(self.lang, "nav_probability"),
            font=("Arial", 26, "bold"),
        ).pack(anchor="w", pady=(0, 12))

        if self.lang == "FI":
            formula_text = (
                "KÄYTETTÄVÄ KAAVA\n\n"
                "P = suotuisat tapaukset / kaikki mahdolliset tapaukset\n\n"
                "P = tapahtuman todennäköisyys"
            )
        else:
            formula_text = (
                "FÓRMULA UTILIZADA\n\n"
                "P = casos favorables / casos totales\n\n"
                "P = probabilidad de que ocurra el evento"
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

        self.favorable_entry = create_input(
            self,
            t(self.lang, "favorable_cases"),
        )
        self.total_entry = create_input(
            self,
            t(self.lang, "total_cases"),
        )

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
        self.favorable_entry.insert(0, "3")
        self.total_entry.insert(0, "10")
        self.calculate()

    def clear(self):
        for entry in [
            self.favorable_entry,
            self.total_entry,
        ]:
            entry.delete(0, "end")

        self.result_label.configure(text="—")
        set_steps(self.steps_box, "")

    def calculate(self):
        try:
            favorable = parse_float(
                self.favorable_entry.get(),
                "favorable",
            )
            total = parse_float(
                self.total_entry.get(),
                "total",
            )

            if total <= 0 or favorable < 0 or favorable > total:
                raise ValueError

            probability = favorable / total
            percent = probability * 100

            self.result_label.configure(
                text=f"P = {probability:.4f} = {percent:.2f} %"
            )

            if self.lang == "FI":
                steps = f"""
Käytettävä kaava:

P = suotuisat tapaukset / kaikki mahdolliset tapaukset

Sijoitetaan arvot:

P = {favorable:.2f} / {total:.2f}

P = {probability:.4f}

Muutetaan prosentiksi:

P × 100 = {probability:.4f} × 100

P = {percent:.2f} %
"""
            else:
                steps = f"""
Fórmula utilizada:

P = casos favorables / casos totales

Sustituimos los valores:

P = {favorable:.2f} / {total:.2f}

P = {probability:.4f}

Convertimos a porcentaje:

P × 100 = {probability:.4f} × 100

P = {percent:.2f} %
"""

            set_steps(self.steps_box, steps.strip())

        except Exception:
            self.result_label.configure(
                text=t(self.lang, "invalid_input")
            )
