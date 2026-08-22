import customtkinter as ctk

from translations import t
from utils import parse_float, create_input, set_steps


class LoansModule(ctk.CTkFrame):
    def __init__(self, parent, lang):
        super().__init__(parent, fg_color="transparent")
        self.lang = lang
        self.build()

    def build(self):
        ctk.CTkLabel(
            self,
            text=t(self.lang, "nav_loans"),
            font=("Arial", 26, "bold"),
        ).pack(anchor="w", pady=(0, 12))

        tabs = ctk.CTkTabview(self)
        tabs.pack(fill="both", expand=True)

        constant_tab = tabs.add(t(self.lang, "constant_amortization"))
        annuity_tab = tabs.add(t(self.lang, "annuity_loan"))

        self.build_constant(constant_tab)
        self.build_annuity(annuity_tab)

    # ============================================================
    # CONSTANT AMORTIZATION LOAN
    # ============================================================

    def build_constant(self, parent):
        if self.lang == "FI":
            formula_text = (
                "KÄYTETTÄVÄT KAAVAT\n\n"
                "Lyhennys = K / n\n"
                "i = vuosikorko / 12 / 100\n"
                "Saldo = K − lyhennys × (erä − 1)\n"
                "Korko = saldo × i\n"
                "Maksuerä = lyhennys + korko\n\n"
                "K = lainapääoma\n"
                "n = maksuerien kokonaismäärä\n"
                "i = kuukausikorko\n"
                "erä = laskettavan maksuerän numero"
            )
        else:
            formula_text = (
                "FÓRMULAS UTILIZADAS\n\n"
                "Amortización = K / n\n"
                "i = interés anual / 12 / 100\n"
                "Saldo = K − amortización × (cuota − 1)\n"
                "Interés = saldo × i\n"
                "Pago = amortización + interés\n\n"
                "K = capital inicial\n"
                "n = número total de cuotas\n"
                "i = tasa de interés mensual\n"
                "cuota = número de la cuota que queremos calcular"
            )

        formula_card = ctk.CTkFrame(parent, corner_radius=10)
        formula_card.pack(fill="x", pady=(10, 16))

        ctk.CTkLabel(
            formula_card,
            text=formula_text,
            font=("Arial", 15),
            justify="left",
            anchor="w",
        ).pack(fill="x", padx=18, pady=16)

        self.k_entry = create_input(parent, t(self.lang, "capital"))
        self.n_entry = create_input(parent, t(self.lang, "months"))
        self.rate_entry = create_input(parent, t(self.lang, "annual_interest"))
        self.er_entry = create_input(parent, t(self.lang, "installment_number"))

        buttons = ctk.CTkFrame(parent, fg_color="transparent")
        buttons.pack(anchor="w", pady=12)

        ctk.CTkButton(
            buttons,
            text=t(self.lang, "calculate"),
            command=self.calculate_constant,
            width=150,
        ).pack(side="left", padx=(0, 10))

        ctk.CTkButton(
            buttons,
            text=t(self.lang, "example"),
            command=self.fill_constant_example,
            width=130,
        ).pack(side="left", padx=(0, 10))

        ctk.CTkButton(
            buttons,
            text=t(self.lang, "clear"),
            command=self.clear_constant,
            width=130,
            fg_color="#7f8c8d",
            hover_color="#6c7a7d",
        ).pack(side="left")

        self.result_constant = ctk.CTkLabel(
            parent,
            text="—",
            font=("Arial", 25, "bold"),
        )
        self.result_constant.pack(anchor="w", pady=8)

        self.steps_constant = ctk.CTkTextbox(parent, height=260)
        self.steps_constant.pack(fill="both", expand=True, pady=8)
        self.steps_constant.configure(state="disabled")

    def fill_constant_example(self):
        self.clear_constant()
        self.k_entry.insert(0, "210000")
        self.n_entry.insert(0, "300")
        self.rate_entry.insert(0, "5,3")
        self.er_entry.insert(0, "12")
        self.calculate_constant()

    def clear_constant(self):
        for entry in [
            self.k_entry,
            self.n_entry,
            self.rate_entry,
            self.er_entry,
        ]:
            entry.delete(0, "end")

        self.result_constant.configure(text="—")
        set_steps(self.steps_constant, "")

    def calculate_constant(self):
        try:
            capital = parse_float(self.k_entry.get(), "K")
            months = parse_float(self.n_entry.get(), "n")
            annual_rate = parse_float(self.rate_entry.get(), "rate")
            installment = parse_float(self.er_entry.get(), "installment")

            if months <= 0 or installment <= 0:
                raise ValueError

            if installment > months:
                if self.lang == "FI":
                    message = (
                        "Laskettavan erän numero ei voi olla suurempi kuin "
                        "maksuerien kokonaismäärä."
                    )
                else:
                    message = (
                        "La cuota que quieres calcular no puede ser mayor "
                        "que el número total de cuotas."
                    )

                self.result_constant.configure(
                    text=t(self.lang, "invalid_input")
                )
                set_steps(self.steps_constant, message)
                return

            monthly_rate = annual_rate / 12 / 100
            amortization = capital / months
            balance_before = capital - amortization * (installment - 1)
            interest = balance_before * monthly_rate
            payment = amortization + interest
            remaining = balance_before - amortization

            self.result_constant.configure(
                text=f"{t(self.lang, 'total_payment')}: {payment:.2f} €"
            )

            if self.lang == "FI":
                steps = f"""
K = {capital:.2f} €
n = {months:.0f}
Vuosikorko = {annual_rate:.2f} %
Laskettava erä = {installment:.0f}

1. Kuukausikoron laskeminen

i = vuosikorko / 12 / 100
i = {annual_rate:.2f} / 12 / 100
i = {monthly_rate:.6f}

2. Kuukausittainen lyhennys

Lyhennys = K / n
Lyhennys = {capital:.2f} / {months:.0f}
Lyhennys = {amortization:.2f} €

3. Saldo ennen erää {installment:.0f}

Saldo = K − lyhennys × (erä − 1)
Saldo = {capital:.2f} − {amortization:.2f} × ({installment:.0f} − 1)
Saldo = {balance_before:.2f} €

4. Erän korko

Korko = saldo × i
Korko = {balance_before:.2f} × {monthly_rate:.6f}
Korko = {interest:.2f} €

5. Maksuerä

Maksuerä = lyhennys + korko
Maksuerä = {amortization:.2f} + {interest:.2f}
Maksuerä = {payment:.2f} €

6. Jäljellä oleva saldo

{balance_before:.2f} − {amortization:.2f}
= {remaining:.2f} €
"""
            else:
                steps = f"""
K = {capital:.2f} €
n = {months:.0f}
Interés anual = {annual_rate:.2f} %
Cuota calculada = {installment:.0f}

1. Calculamos la tasa de interés mensual

i = interés anual / 12 / 100
i = {annual_rate:.2f} / 12 / 100
i = {monthly_rate:.6f}

2. Calculamos la amortización mensual

Amortización = K / n
Amortización = {capital:.2f} / {months:.0f}
Amortización = {amortization:.2f} €

3. Calculamos el saldo antes de la cuota {installment:.0f}

Saldo = K − amortización × (cuota − 1)
Saldo = {capital:.2f} − {amortization:.2f} × ({installment:.0f} − 1)
Saldo = {balance_before:.2f} €

4. Calculamos el interés de la cuota

Interés = saldo × i
Interés = {balance_before:.2f} × {monthly_rate:.6f}
Interés = {interest:.2f} €

5. Calculamos el pago total

Pago = amortización + interés
Pago = {amortization:.2f} + {interest:.2f}
Pago = {payment:.2f} €

6. Calculamos el saldo restante

{balance_before:.2f} − {amortization:.2f}
= {remaining:.2f} €
"""

            set_steps(self.steps_constant, steps.strip())

        except Exception:
            self.result_constant.configure(
                text=t(self.lang, "invalid_input")
            )

    # ============================================================
    # ANNUITY LOAN
    # ============================================================

    def build_annuity(self, parent):
        if self.lang == "FI":
            formula_text = (
                "KÄYTETTÄVÄT KAAVAT\n\n"
                "i = vuosikorko / 12 / 100\n"
                "A = (K × i) / (1 − (1 + i)^(-n))\n\n"
                "K = lainapääoma\n"
                "i = kuukausikorko\n"
                "n = maksuerien määrä\n"
                "A = vakio maksuerä"
            )
        else:
            formula_text = (
                "FÓRMULAS UTILIZADAS\n\n"
                "i = interés anual / 12 / 100\n"
                "A = (K × i) / (1 − (1 + i)^(-n))\n\n"
                "K = capital inicial\n"
                "i = tasa de interés mensual\n"
                "n = número de cuotas\n"
                "A = cuota fija"
            )

        formula_card = ctk.CTkFrame(parent, corner_radius=10)
        formula_card.pack(fill="x", pady=(10, 16))

        ctk.CTkLabel(
            formula_card,
            text=formula_text,
            font=("Arial", 15),
            justify="left",
            anchor="w",
        ).pack(fill="x", padx=18, pady=16)

        self.ann_k_entry = create_input(parent, t(self.lang, "capital"))
        self.ann_n_entry = create_input(parent, t(self.lang, "months"))
        self.ann_rate_entry = create_input(
            parent,
            t(self.lang, "annual_interest"),
        )

        buttons = ctk.CTkFrame(parent, fg_color="transparent")
        buttons.pack(anchor="w", pady=12)

        ctk.CTkButton(
            buttons,
            text=t(self.lang, "calculate"),
            command=self.calculate_annuity,
            width=150,
        ).pack(side="left", padx=(0, 10))

        ctk.CTkButton(
            buttons,
            text=t(self.lang, "example"),
            command=self.fill_annuity_example,
            width=130,
        ).pack(side="left", padx=(0, 10))

        ctk.CTkButton(
            buttons,
            text=t(self.lang, "clear"),
            command=self.clear_annuity,
            width=130,
            fg_color="#7f8c8d",
            hover_color="#6c7a7d",
        ).pack(side="left")

        self.result_annuity = ctk.CTkLabel(
            parent,
            text="—",
            font=("Arial", 25, "bold"),
        )
        self.result_annuity.pack(anchor="w", pady=8)

        self.steps_annuity = ctk.CTkTextbox(parent, height=260)
        self.steps_annuity.pack(fill="both", expand=True, pady=8)
        self.steps_annuity.configure(state="disabled")

    def fill_annuity_example(self):
        self.clear_annuity()
        self.ann_k_entry.insert(0, "210000")
        self.ann_n_entry.insert(0, "300")
        self.ann_rate_entry.insert(0, "5,3")
        self.calculate_annuity()

    def clear_annuity(self):
        for entry in [
            self.ann_k_entry,
            self.ann_n_entry,
            self.ann_rate_entry,
        ]:
            entry.delete(0, "end")

        self.result_annuity.configure(text="—")
        set_steps(self.steps_annuity, "")

    def calculate_annuity(self):
        try:
            capital = parse_float(self.ann_k_entry.get(), "K")
            months = parse_float(self.ann_n_entry.get(), "n")
            annual_rate = parse_float(
                self.ann_rate_entry.get(),
                "rate",
            )

            if months <= 0:
                raise ValueError

            monthly_rate = annual_rate / 12 / 100

            if monthly_rate == 0:
                payment = capital / months
            else:
                payment = (
                    capital * monthly_rate
                ) / (
                    1 - (1 + monthly_rate) ** (-months)
                )

            first_interest = capital * monthly_rate
            first_amortization = payment - first_interest
            remaining = capital - first_amortization

            self.result_annuity.configure(
                text=f"{t(self.lang, 'annuity_payment')}: {payment:.2f} €"
            )

            if self.lang == "FI":
                steps = f"""
K = {capital:.2f} €
n = {months:.0f}
Vuosikorko = {annual_rate:.2f} %

1. Kuukausikorko

i = vuosikorko / 12 / 100
i = {annual_rate:.2f} / 12 / 100
i = {monthly_rate:.6f}

2. Annuiteetin laskeminen

A = (K × i) / (1 − (1 + i)^(-n))

A = ({capital:.2f} × {monthly_rate:.6f}) /
    (1 − (1 + {monthly_rate:.6f})^(-{months:.0f}))

A = {payment:.2f} €

3. Ensimmäisen erän korko

Korko = K × i
Korko = {capital:.2f} × {monthly_rate:.6f}
Korko = {first_interest:.2f} €

4. Ensimmäisen erän lyhennys

Lyhennys = A − korko
Lyhennys = {payment:.2f} − {first_interest:.2f}
Lyhennys = {first_amortization:.2f} €

5. Jäljellä oleva saldo

Saldo = K − lyhennys
Saldo = {capital:.2f} − {first_amortization:.2f}
Saldo = {remaining:.2f} €
"""
            else:
                steps = f"""
K = {capital:.2f} €
n = {months:.0f}
Interés anual = {annual_rate:.2f} %

1. Calculamos la tasa de interés mensual

i = interés anual / 12 / 100
i = {annual_rate:.2f} / 12 / 100
i = {monthly_rate:.6f}

2. Calculamos la cuota fija

A = (K × i) / (1 − (1 + i)^(-n))

A = ({capital:.2f} × {monthly_rate:.6f}) /
    (1 − (1 + {monthly_rate:.6f})^(-{months:.0f}))

A = {payment:.2f} €

3. Calculamos el interés de la primera cuota

Interés = K × i
Interés = {capital:.2f} × {monthly_rate:.6f}
Interés = {first_interest:.2f} €

4. Calculamos la amortización de la primera cuota

Amortización = A − interés
Amortización = {payment:.2f} − {first_interest:.2f}
Amortización = {first_amortization:.2f} €

5. Calculamos el saldo restante

Saldo = K − amortización
Saldo = {capital:.2f} − {first_amortization:.2f}
Saldo = {remaining:.2f} €
"""

            set_steps(self.steps_annuity, steps.strip())

        except Exception:
            self.result_annuity.configure(
                text=t(self.lang, "invalid_input")
            )
