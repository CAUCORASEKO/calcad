import math
import customtkinter as ctk

from translations import t
from utils import parse_float, create_input, set_steps


class EquationsModule(ctk.CTkFrame):
    def __init__(self, parent, lang):
        super().__init__(parent, fg_color="transparent")
        self.lang = lang
        self.build()

    def build(self):
        ctk.CTkLabel(
            self,
            text=t(self.lang, "nav_equations"),
            font=("Arial", 26, "bold"),
        ).pack(anchor="w", pady=(0, 12))

        tabs = ctk.CTkTabview(self)
        tabs.pack(fill="both", expand=True)

        linear_tab = tabs.add(t(self.lang, "linear_equation"))
        quadratic_tab = tabs.add(t(self.lang, "quadratic_equation"))

        self.build_linear(linear_tab)
        self.build_quadratic(quadratic_tab)

    # ============================================================
    # LINEAR EQUATION
    # ============================================================

    def build_linear(self, parent):
        if self.lang == "FI":
            formula_text = (
                "KÄYTETTÄVÄ KAAVA\n\n"
                "ax + b = c\n"
                "x = (c − b) / a\n\n"
                "a = x:n kerroin\n"
                "b = vakio\n"
                "c = yhtälön oikean puolen arvo\n"
                "x = ratkaistava tuntematon"
            )
        else:
            formula_text = (
                "FÓRMULA UTILIZADA\n\n"
                "ax + b = c\n"
                "x = (c − b) / a\n\n"
                "a = coeficiente de x\n"
                "b = término constante\n"
                "c = valor del lado derecho de la ecuación\n"
                "x = incógnita que queremos calcular"
            )

        card = ctk.CTkFrame(parent, corner_radius=10)
        card.pack(fill="x", pady=(10, 16))

        ctk.CTkLabel(
            card,
            text=formula_text,
            font=("Arial", 15),
            justify="left",
            anchor="w",
        ).pack(fill="x", padx=18, pady=16)

        self.la_entry = create_input(parent, "a")
        self.lb_entry = create_input(parent, "b")
        self.lc_entry = create_input(parent, "c")

        buttons = ctk.CTkFrame(parent, fg_color="transparent")
        buttons.pack(anchor="w", pady=12)

        ctk.CTkButton(
            buttons,
            text=t(self.lang, "calculate"),
            command=self.calculate_linear,
            width=150,
        ).pack(side="left", padx=(0, 10))

        ctk.CTkButton(
            buttons,
            text=t(self.lang, "example"),
            command=self.fill_linear_example,
            width=130,
        ).pack(side="left", padx=(0, 10))

        ctk.CTkButton(
            buttons,
            text=t(self.lang, "clear"),
            command=self.clear_linear,
            width=130,
            fg_color="#7f8c8d",
            hover_color="#6c7a7d",
        ).pack(side="left")

        self.linear_result = ctk.CTkLabel(
            parent,
            text="—",
            font=("Arial", 25, "bold"),
        )
        self.linear_result.pack(anchor="w", pady=8)

        self.linear_steps = ctk.CTkTextbox(parent, height=250)
        self.linear_steps.pack(fill="both", expand=True, pady=8)
        self.linear_steps.configure(state="disabled")

    def fill_linear_example(self):
        self.clear_linear()
        self.la_entry.insert(0, "2")
        self.lb_entry.insert(0, "5")
        self.lc_entry.insert(0, "17")
        self.calculate_linear()

    def clear_linear(self):
        for entry in [
            self.la_entry,
            self.lb_entry,
            self.lc_entry,
        ]:
            entry.delete(0, "end")

        self.linear_result.configure(text="—")
        set_steps(self.linear_steps, "")

    def calculate_linear(self):
        try:
            a = parse_float(self.la_entry.get(), "a")
            b = parse_float(self.lb_entry.get(), "b")
            c = parse_float(self.lc_entry.get(), "c")

            if a == 0:
                raise ZeroDivisionError

            x = (c - b) / a

            self.linear_result.configure(text=f"x = {x:.4f}")

            if self.lang == "FI":
                steps = f"""
Käytettävä kaava:

ax + b = c

{a:.2f}x + {b:.2f} = {c:.2f}

1. Vähennetään b molemmilta puolilta

{a:.2f}x = {c:.2f} − {b:.2f}

{a:.2f}x = {c - b:.2f}

2. Jaetaan a:lla

x = (c − b) / a

x = ({c:.2f} − {b:.2f}) / {a:.2f}

x = {x:.4f}
"""
            else:
                steps = f"""
Fórmula utilizada:

ax + b = c

{a:.2f}x + {b:.2f} = {c:.2f}

1. Restamos b en ambos lados

{a:.2f}x = {c:.2f} − {b:.2f}

{a:.2f}x = {c - b:.2f}

2. Dividimos por a

x = (c − b) / a

x = ({c:.2f} − {b:.2f}) / {a:.2f}

x = {x:.4f}
"""

            set_steps(self.linear_steps, steps.strip())

        except ZeroDivisionError:
            self.linear_result.configure(
                text=t(self.lang, "division_by_zero")
            )
        except Exception:
            self.linear_result.configure(
                text=t(self.lang, "invalid_input")
            )

    # ============================================================
    # QUADRATIC EQUATION
    # ============================================================

    def build_quadratic(self, parent):
        if self.lang == "FI":
            formula_text = (
                "KÄYTETTÄVÄT KAAVAT\n\n"
                "ax² + bx + c = 0\n"
                "D = b² − 4ac\n"
                "x = (−b ± √D) / (2a)\n\n"
                "a, b, c = yhtälön kertoimet\n"
                "D = diskriminantti\n"
                "x = yhtälön ratkaisu"
            )
        else:
            formula_text = (
                "FÓRMULAS UTILIZADAS\n\n"
                "ax² + bx + c = 0\n"
                "D = b² − 4ac\n"
                "x = (−b ± √D) / (2a)\n\n"
                "a, b, c = coeficientes de la ecuación\n"
                "D = discriminante\n"
                "x = solución de la ecuación"
            )

        card = ctk.CTkFrame(parent, corner_radius=10)
        card.pack(fill="x", pady=(10, 16))

        ctk.CTkLabel(
            card,
            text=formula_text,
            font=("Arial", 15),
            justify="left",
            anchor="w",
        ).pack(fill="x", padx=18, pady=16)

        self.qa_entry = create_input(parent, "a")
        self.qb_entry = create_input(parent, "b")
        self.qc_entry = create_input(parent, "c")

        buttons = ctk.CTkFrame(parent, fg_color="transparent")
        buttons.pack(anchor="w", pady=12)

        ctk.CTkButton(
            buttons,
            text=t(self.lang, "calculate"),
            command=self.calculate_quadratic,
            width=150,
        ).pack(side="left", padx=(0, 10))

        ctk.CTkButton(
            buttons,
            text=t(self.lang, "example"),
            command=self.fill_quadratic_example,
            width=130,
        ).pack(side="left", padx=(0, 10))

        ctk.CTkButton(
            buttons,
            text=t(self.lang, "clear"),
            command=self.clear_quadratic,
            width=130,
            fg_color="#7f8c8d",
            hover_color="#6c7a7d",
        ).pack(side="left")

        self.quadratic_result = ctk.CTkLabel(
            parent,
            text="—",
            font=("Arial", 25, "bold"),
        )
        self.quadratic_result.pack(anchor="w", pady=8)

        self.quadratic_steps = ctk.CTkTextbox(parent, height=280)
        self.quadratic_steps.pack(fill="both", expand=True, pady=8)
        self.quadratic_steps.configure(state="disabled")

    def fill_quadratic_example(self):
        self.clear_quadratic()
        self.qa_entry.insert(0, "1")
        self.qb_entry.insert(0, "-5")
        self.qc_entry.insert(0, "6")
        self.calculate_quadratic()

    def clear_quadratic(self):
        for entry in [
            self.qa_entry,
            self.qb_entry,
            self.qc_entry,
        ]:
            entry.delete(0, "end")

        self.quadratic_result.configure(text="—")
        set_steps(self.quadratic_steps, "")

    def calculate_quadratic(self):
        try:
            a = parse_float(self.qa_entry.get(), "a")
            b = parse_float(self.qb_entry.get(), "b")
            c = parse_float(self.qc_entry.get(), "c")

            if a == 0:
                raise ZeroDivisionError

            discriminant = b ** 2 - 4 * a * c

            if self.lang == "FI":
                intro = "1. Lasketaan diskriminantti"

                if discriminant > 0:
                    sqrt_d = math.sqrt(discriminant)
                    x1 = (-b + sqrt_d) / (2 * a)
                    x2 = (-b - sqrt_d) / (2 * a)

                    result = f"x1 = {x1:.4f}, x2 = {x2:.4f}"

                    solution = f"""
2. Koska D > 0, yhtälöllä on kaksi reaalista ratkaisua

√D = √{discriminant:.2f}
√D = {sqrt_d:.4f}

x1 = (−b + √D) / (2a)
x1 = (−({b:.2f}) + {sqrt_d:.4f}) / (2 × {a:.2f})
x1 = {x1:.4f}

x2 = (−b − √D) / (2a)
x2 = (−({b:.2f}) − {sqrt_d:.4f}) / (2 × {a:.2f})
x2 = {x2:.4f}
"""

                elif discriminant == 0:
                    x = -b / (2 * a)

                    result = f"x = {x:.4f}"

                    solution = f"""
2. Koska D = 0, yhtälöllä on yksi kaksinkertainen ratkaisu

x = −b / (2a)

x = −({b:.2f}) / (2 × {a:.2f})

x = {x:.4f}
"""

                else:
                    result = "Ei reaalisia ratkaisuja"

                    solution = """
2. Koska D < 0, yhtälöllä ei ole reaalisia ratkaisuja.
"""

                steps = f"""
ax² + bx + c = 0

{a:.2f}x² + {b:.2f}x + {c:.2f} = 0

{intro}

D = b² − 4ac

D = ({b:.2f})² − 4 × {a:.2f} × {c:.2f}

D = {discriminant:.2f}

{solution}
"""

            else:
                intro = "1. Calculamos el discriminante"

                if discriminant > 0:
                    sqrt_d = math.sqrt(discriminant)
                    x1 = (-b + sqrt_d) / (2 * a)
                    x2 = (-b - sqrt_d) / (2 * a)

                    result = f"x1 = {x1:.4f}, x2 = {x2:.4f}"

                    solution = f"""
2. Como D > 0, existen dos soluciones reales

√D = √{discriminant:.2f}
√D = {sqrt_d:.4f}

x1 = (−b + √D) / (2a)
x1 = (−({b:.2f}) + {sqrt_d:.4f}) / (2 × {a:.2f})
x1 = {x1:.4f}

x2 = (−b − √D) / (2a)
x2 = (−({b:.2f}) − {sqrt_d:.4f}) / (2 × {a:.2f})
x2 = {x2:.4f}
"""

                elif discriminant == 0:
                    x = -b / (2 * a)

                    result = f"x = {x:.4f}"

                    solution = f"""
2. Como D = 0, existe una solución real doble

x = −b / (2a)

x = −({b:.2f}) / (2 × {a:.2f})

x = {x:.4f}
"""

                else:
                    result = "No hay soluciones reales"

                    solution = """
2. Como D < 0, la ecuación no tiene soluciones reales.
"""

                steps = f"""
ax² + bx + c = 0

{a:.2f}x² + {b:.2f}x + {c:.2f} = 0

{intro}

D = b² − 4ac

D = ({b:.2f})² − 4 × {a:.2f} × {c:.2f}

D = {discriminant:.2f}

{solution}
"""

            self.quadratic_result.configure(text=result)
            set_steps(self.quadratic_steps, steps.strip())

        except ZeroDivisionError:
            self.quadratic_result.configure(
                text=t(self.lang, "division_by_zero")
            )
        except Exception:
            self.quadratic_result.configure(
                text=t(self.lang, "invalid_input")
            )
