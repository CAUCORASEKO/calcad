import customtkinter as ctk

from translations import t
from utils import parse_float, create_input, set_steps


class InflationModule(ctk.CTkFrame):
    def __init__(self, parent, lang):
        super().__init__(parent, fg_color="transparent")
        self.lang = lang
        self.build()

    def build(self):
        ctk.CTkLabel(
            self,
            text=t(self.lang, "nav_inflation"),
            font=("Arial", 26, "bold"),
        ).pack(anchor="w", pady=(0, 12))

        if self.lang == "FI":
            formula_text = (
                "KÄYTETTÄVÄT KAAVAT\n\n"
                "Hintojen nousu % = (KHI2 / KHI1 × 100) − 100\n"
                "q = (KHI2 / KHI1)^(1/n)\n"
                "Vuotuinen inflaatio % = (q − 1) × 100\n\n"
                "KHI1 = alkuperäinen kuluttajahintaindeksi\n"
                "KHI2 = uusi kuluttajahintaindeksi\n"
                "n = vuosien määrä\n"
                "q = vuotuinen muutoskerroin"
            )
        else:
            formula_text = (
                "FÓRMULAS UTILIZADAS\n\n"
                "Inflación total % = (IPC2 / IPC1 × 100) − 100\n"
                "q = (IPC2 / IPC1)^(1/n)\n"
                "Inflación anual % = (q − 1) × 100\n\n"
                "IPC1 = índice de precios inicial\n"
                "IPC2 = índice de precios final\n"
                "n = número de años\n"
                "q = factor anual de cambio"
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

        self.khi1_entry = create_input(self, t(self.lang, "cpi_initial"))
        self.khi2_entry = create_input(self, t(self.lang, "cpi_final"))
        self.years_entry = create_input(self, t(self.lang, "years"))

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

        self.steps_box = ctk.CTkTextbox(self, height=290)
        self.steps_box.pack(fill="both", expand=True, pady=8)
        self.steps_box.configure(state="disabled")

    def fill_example(self):
        self.clear()
        self.khi1_entry.insert(0, "100")
        self.khi2_entry.insert(0, "112")
        self.years_entry.insert(0, "3")
        self.calculate()

    def clear(self):
        for entry in [
            self.khi1_entry,
            self.khi2_entry,
            self.years_entry,
        ]:
            entry.delete(0, "end")

        self.result_label.configure(text="—")
        set_steps(self.steps_box, "")

    def calculate(self):
        try:
            first = parse_float(self.khi1_entry.get(), "KHI1")
            second = parse_float(self.khi2_entry.get(), "KHI2")
            years = parse_float(self.years_entry.get(), "years")

            if first <= 0 or second <= 0 or years <= 0:
                raise ValueError

            total = (second / first * 100) - 100
            q = (second / first) ** (1 / years)
            annual = (q - 1) * 100

            self.result_label.configure(
                text=f"{t(self.lang, 'total_inflation')}: {total:.2f} %"
            )

            if self.lang == "FI":
                steps = f"""
1. Lasketaan hintojen kokonaisnousu

Hintojen nousu % = (KHI2 / KHI1 × 100) − 100

= ({second:.2f} / {first:.2f} × 100) − 100

= {total:.2f} %

2. Lasketaan vuotuinen kerroin

q = (KHI2 / KHI1)^(1/n)

q = ({second:.2f} / {first:.2f})^(1/{years:.2f})

q = {q:.6f}

3. Lasketaan vuotuinen inflaatio

Vuotuinen inflaatio % = (q − 1) × 100

= ({q:.6f} − 1) × 100

= {annual:.2f} %
"""
            else:
                steps = f"""
1. Calculamos la inflación total

Inflación total % = (IPC2 / IPC1 × 100) − 100

= ({second:.2f} / {first:.2f} × 100) − 100

= {total:.2f} %

2. Calculamos el factor anual

q = (IPC2 / IPC1)^(1/n)

q = ({second:.2f} / {first:.2f})^(1/{years:.2f})

q = {q:.6f}

3. Calculamos la inflación anual

Inflación anual % = (q − 1) × 100

= ({q:.6f} − 1) × 100

= {annual:.2f} %
"""

            set_steps(self.steps_box, steps.strip())

        except Exception:
            self.result_label.configure(
                text=t(self.lang, "invalid_input")
            )
