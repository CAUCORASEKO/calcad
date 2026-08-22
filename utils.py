import customtkinter as ctk


def parse_float(value: str, field_name: str) -> float:
    if value is None or value.strip() == "":
        raise ValueError(f"{field_name}: empty")

    clean = value.strip().replace(",", ".")
    try:
        return float(clean)
    except ValueError:
        raise ValueError(f"{field_name}: invalid number")


def create_input(parent, label_text):
    container = ctk.CTkFrame(parent, fg_color="transparent")
    container.pack(fill="x", pady=6)

    label = ctk.CTkLabel(container, text=label_text, anchor="w")
    label.pack(fill="x")

    entry = ctk.CTkEntry(container, height=36)
    entry.pack(fill="x", pady=(4, 0))

    return entry


def set_steps(textbox, content):
    textbox.configure(state="normal")
    textbox.delete("1.0", "end")
    textbox.insert("1.0", content)
    textbox.configure(state="disabled")
