import math
import customtkinter as ctk

from translations import t
from utils import parse_float, create_input, set_steps


class TrigonometryModule(ctk.CTkFrame):
    def __init__(self, parent, lang):
        super().__init__(parent, fg_color="transparent")
        self.lang = lang
        self.build()

    def build(self):
        ctk.CTkLabel(
            self,
            text=t(self.lang, "nav_trigonometry"),
            font=("Arial", 26, "bold"),
        ).pack(anchor="w", pady=(0, 12))

        if self.lang == "FI":
            formula_text = (
                "KÄYTETTÄVÄ KAAVA\n\n"
                "tan A = vastakkainen kateetti / viereinen kateetti\n"
                "A = arctan(vastakkainen / viereinen)\n\n"
                "A = laskettava kulma"
            )
        else:
            formula_text = (
                "FÓRMULA UTILIZADA\n\n"
                "tan A = cateto opuesto / cateto adyacente\n"
                "A = arctan(opuesto / adyacente)\n\n"
                "A = ángulo que queremos calcular"
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

        self.opposite_entry = create_input(
            self,
            t(self.lang, "opposite"),
        )
        self.adjacent_entry = create_input(
            self,
            t(self.lang, "adjacent"),
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

        self.steps_box = ctk.CTkTextbox(self, height=270)
        self.steps_box.pack(fill="both", expand=True, pady=8)
        self.steps_box.configure(state="disabled")

    def fill_example(self):
        self.clear()
        self.opposite_entry.insert(0, "3")
        self.adjacent_entry.insert(0, "4")
        self.calculate()

    def clear(self):
        for entry in [
            self.opposite_entry,
            self.adjacent_entry,
        ]:
            entry.delete(0, "end")

        self.result_label.configure(text="—")
        set_steps(self.steps_box, "")

    def calculate(self):
        try:
            opposite = parse_float(
                self.opposite_entry.get(),
                "opposite",
            )
            adjacent = parse_float(
                self.adjacent_entry.get(),
                "adjacent",
            )

            if adjacent == 0 or opposite < 0 or adjacent < 0:
                raise ValueError

            tangent = opposite / adjacent
            angle = math.degrees(math.atan(tangent))

            self.result_label.configure(
                text=f"{t(self.lang, 'angle')}: {angle:.2f}°"
            )

            if self.lang == "FI":
                steps = f"""
Käytettävä kaava:

tan A = vastakkainen kateetti / viereinen kateetti

1. Sijoitetaan arvot

tan A = {opposite:.2f} / {adjacent:.2f}

tan A = {tangent:.6f}

2. Ratkaistaan kulma käänteistangentilla

A = arctan({tangent:.6f})

A = {angle:.2f}°
"""
            else:
                steps = f"""
Fórmula utilizada:

tan A = cateto opuesto / cateto adyacente

1. Sustituimos los valores

tan A = {opposite:.2f} / {adjacent:.2f}

tan A = {tangent:.6f}

2. Calculamos el ángulo con la tangente inversa

A = arctan({tangent:.6f})

A = {angle:.2f}°
"""

            set_steps(self.steps_box, steps.strip())

        except Exception:
            self.result_label.configure(
                text=t(self.lang, "invalid_input")
            )
