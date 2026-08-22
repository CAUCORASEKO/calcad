import customtkinter as ctk

from translations import t
from utils import parse_float, create_input, set_steps


class ExponentialModule(ctk.CTkFrame):
    def __init__(self, parent, lang):
        super().__init__(parent, fg_color="transparent")
        self.lang = lang
        self.build()

    def build(self):
        ctk.CTkLabel(
            self,
            text=t(self.lang, "nav_exponential"),
            font=("Arial", 26, "bold"),
        ).pack(anchor="w", pady=(0, 12))

        if self.lang == "FI":
            formula_text = (
                "KÄYTETTÄVÄ KAAVA\n\n"
                "f(t) = k · a^t\n\n"
                "k = alkuarvo\n"
                "a = kasvu- tai vähenemiskerroin\n"
                "t = aika\n"
                "f(t) = arvo ajan t jälkeen"
            )
        else:
            formula_text = (
                "FÓRMULA UTILIZADA\n\n"
                "f(t) = k · a^t\n\n"
                "k = valor inicial\n"
                "a = factor de crecimiento o decrecimiento\n"
                "t = tiempo\n"
                "f(t) = valor después del tiempo t"
            )

        formula_card = ctk.CTkFrame(self, corner_radius=10)
        formula_card.pack(fill="x", pady=(10, 16))

        ctk.CTkLabel(
            formula_card,
            text=formula_text,
            font=("Arial", 15),
            justify="left",
            anchor="w",
        ).pack(fill="x", padx=18, pady=16)

        self.k_entry = create_input(
            self,
            t(self.lang, "initial_value"),
        )
        self.a_entry = create_input(
            self,
            t(self.lang, "factor"),
        )
        self.t_entry = create_input(
            self,
            t(self.lang, "time"),
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

        self.steps_box = ctk.CTkTextbox(self, height=280)
        self.steps_box.pack(fill="both", expand=True, pady=8)
        self.steps_box.configure(state="disabled")

    def fill_example(self):
        self.clear()
        self.k_entry.insert(0, "1000")
        self.a_entry.insert(0, "1,05")
        self.t_entry.insert(0, "3")
        self.calculate()

    def clear(self):
        for entry in [
            self.k_entry,
            self.a_entry,
            self.t_entry,
        ]:
            entry.delete(0, "end")

        self.result_label.configure(text="—")
        set_steps(self.steps_box, "")

    def calculate(self):
        try:
            k = parse_float(self.k_entry.get(), "k")
            a = parse_float(self.a_entry.get(), "a")
            time = parse_float(self.t_entry.get(), "t")

            if a < 0 and not time.is_integer():
                raise ValueError

            value = k * (a ** time)

            if self.lang == "FI":
                if a > 1:
                    trend = "Kasvu"
                    explanation = (
                        "Koska a > 1, arvo kasvaa ajan kuluessa."
                    )
                elif 0 < a < 1:
                    trend = "Väheneminen"
                    explanation = (
                        "Koska 0 < a < 1, arvo pienenee ajan kuluessa."
                    )
                elif a == 1:
                    trend = "Vakio"
                    explanation = (
                        "Koska a = 1, arvo pysyy muuttumattomana."
                    )
                else:
                    trend = "Vaihtuva etumerkki"
                    explanation = (
                        "Negatiivinen kerroin voi vaihtaa funktion "
                        "etumerkkiä kokonaislukuarvoilla t."
                    )

                steps = f"""
Käytettävä kaava:

f(t) = k · a^t

Annetut arvot:

k = {k:.2f}
a = {a:.4f}
t = {time:.2f}

1. Sijoitetaan arvot kaavaan

f(t) = {k:.2f} · {a:.4f}^{time:.2f}

2. Lasketaan potenssi

a^t = {a:.4f}^{time:.2f}
a^t = {(a ** time):.6f}

3. Kerrotaan alkuarvolla

f(t) = {k:.2f} · {(a ** time):.6f}

f(t) = {value:.4f}

Funktion tyyppi:
{trend}

{explanation}
"""
            else:
                if a > 1:
                    trend = "Crecimiento"
                    explanation = (
                        "Como a > 1, el valor aumenta con el tiempo."
                    )
                elif 0 < a < 1:
                    trend = "Decrecimiento"
                    explanation = (
                        "Como 0 < a < 1, el valor disminuye con el tiempo."
                    )
                elif a == 1:
                    trend = "Constante"
                    explanation = (
                        "Como a = 1, el valor permanece constante."
                    )
                else:
                    trend = "Signo alternante"
                    explanation = (
                        "Un factor negativo puede alternar el signo "
                        "para valores enteros de t."
                    )

                steps = f"""
Fórmula utilizada:

f(t) = k · a^t

Valores dados:

k = {k:.2f}
a = {a:.4f}
t = {time:.2f}

1. Sustituimos los valores en la fórmula

f(t) = {k:.2f} · {a:.4f}^{time:.2f}

2. Calculamos la potencia

a^t = {a:.4f}^{time:.2f}
a^t = {(a ** time):.6f}

3. Multiplicamos por el valor inicial

f(t) = {k:.2f} · {(a ** time):.6f}

f(t) = {value:.4f}

Tipo de función:
{trend}

{explanation}
"""

            self.result_label.configure(
                text=f"f(t) = {value:.4f}"
            )
            set_steps(self.steps_box, steps.strip())

        except Exception:
            self.result_label.configure(
                text=t(self.lang, "invalid_input")
            )
