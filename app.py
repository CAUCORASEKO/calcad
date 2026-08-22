import customtkinter as ctk

from styles import configure_theme, APP_WIDTH, APP_HEIGHT
from translations import t

from modules.loans import LoansModule
from modules.contribution_margin import ContributionMarginModule
from modules.indexes import IndexesModule
from modules.inflation import InflationModule
from modules.probability import ProbabilityModule
from modules.equations import EquationsModule
from modules.trigonometry import TrigonometryModule
from modules.exponential import ExponentialModule


class MathExamHelperApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        configure_theme()

        self.lang = "ES"
        self.title("CalcAd")

        # Tamaño inicial grande, pero no obligatorio.
        self.geometry(f"{APP_WIDTH}x{APP_HEIGHT}")

        # Ahora permitimos una ventana más pequeña.
        self.minsize(820, 560)

        self.current_module_key = "loans"

        self.modules = {
            "loans": LoansModule,
            "contribution": ContributionMarginModule,
            "indexes": IndexesModule,
            "inflation": InflationModule,
            "probability": ProbabilityModule,
            "equations": EquationsModule,
            "trigonometry": TrigonometryModule,
            "exponential": ExponentialModule,
        }

        # Layout principal con grid responsive.
        self.grid_columnconfigure(0, weight=0)
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        self.sidebar = ctk.CTkFrame(self, width=230, fg_color="#151517", corner_radius=0)
        self.sidebar.grid(row=0, column=0, sticky="nsw")
        self.sidebar.grid_propagate(False)

        self.main_area = ctk.CTkFrame(self, fg_color="#101012", corner_radius=0)
        self.main_area.grid(row=0, column=1, sticky="nsew")

        self.main_area.grid_columnconfigure(0, weight=1)
        self.main_area.grid_rowconfigure(1, weight=1)

        self.header = ctk.CTkFrame(self.main_area, fg_color="transparent")
        self.header.grid(row=0, column=0, sticky="ew", padx=20, pady=(16, 6))

        self.header.grid_columnconfigure(0, weight=1)
        self.header.grid_columnconfigure(1, weight=0)
        self.header.grid_columnconfigure(2, weight=0)

        self.title_label = ctk.CTkLabel(
            self.header,
            text=t(self.lang, "app_title"),
            font=("Arial", 28, "bold")
        )
        self.title_label.grid(row=0, column=0, sticky="w")

        self.language_label = ctk.CTkLabel(
            self.header,
            text=t(self.lang, "language"),
            font=("Arial", 14)
        )
        self.language_label.grid(row=0, column=1, sticky="e", padx=(0, 10))

        self.language_menu = ctk.CTkOptionMenu(
            self.header,
            values=["EN", "ES", "FI"],
            command=self.change_language,
            width=90
        )
        self.language_menu.set(self.lang)
        self.language_menu.grid(row=0, column=2, sticky="e")

        # Área con scroll vertical.
        # Esto evita que se pierda la parte inferior al achicar la ventana.
        self.content = ctk.CTkScrollableFrame(
            self.main_area,
            fg_color="transparent"
        )
        self.content.grid(row=1, column=0, sticky="nsew", padx=20, pady=12)
        self.content.grid_columnconfigure(0, weight=1)

        self.build_sidebar()
        self.show_module("loans")

        # Ajuste simple cuando cambia el tamaño.
        self.bind("<Configure>", self.on_resize)

    def build_sidebar(self):
        for widget in self.sidebar.winfo_children():
            widget.destroy()

        logo = ctk.CTkLabel(
            self.sidebar,
            text="CalcAd",
            font=("Arial", 24, "bold"),
            justify="left"
        )
        logo.pack(anchor="w", padx=20, pady=(24, 30))

        items = [
            ("loans", "nav_loans"),
            ("contribution", "nav_contribution"),
            ("indexes", "nav_indexes"),
            ("inflation", "nav_inflation"),
            ("probability", "nav_probability"),
            ("equations", "nav_equations"),
            ("trigonometry", "nav_trigonometry"),
            ("exponential", "nav_exponential"),
        ]

        for module_key, translation_key in items:
            button = ctk.CTkButton(
                self.sidebar,
                text=t(self.lang, translation_key),
                height=40,
                anchor="w",
                fg_color="#ff9f0a" if module_key == self.current_module_key else "#2c2c2e",
                hover_color="#d98200" if module_key == self.current_module_key else "#3a3a3c",
                text_color="#111111" if module_key == self.current_module_key else "#f5f5f7",
                command=lambda key=module_key: self.show_module(key)
            )
            button.pack(fill="x", padx=14, pady=5)

    def show_module(self, module_key):
        self.current_module_key = module_key

        for widget in self.content.winfo_children():
            widget.destroy()

        module_class = self.modules[module_key]
        module = module_class(self.content, self.lang)
        module.grid(row=0, column=0, sticky="nsew")

        # Highlight computed values consistently across all modules.
        for name, widget in vars(module).items():
            if "result" in name.lower() and isinstance(widget, ctk.CTkLabel):
                widget.configure(text_color="#ff9f0a")

    def change_language(self, new_lang):
        self.lang = new_lang
        self.title_label.configure(text=t(self.lang, "app_title"))
        self.language_label.configure(text=t(self.lang, "language"))
        self.build_sidebar()
        self.show_module(self.current_module_key)

    def on_resize(self, event):
        """
        Responsive básico:
        - En ventanas angostas, achicamos el sidebar.
        - En ventanas normales, usamos sidebar más cómodo.
        """
        width = self.winfo_width()

        if width < 950:
            self.sidebar.configure(width=190)
            self.title_label.configure(font=("Arial", 23, "bold"))
        else:
            self.sidebar.configure(width=230)
            self.title_label.configure(font=("Arial", 28, "bold"))
