import customtkinter as ctk

# Tamaño inicial más razonable para MacBook.
APP_WIDTH = 1050
APP_HEIGHT = 680

FONT_TITLE = ("Arial", 28, "bold")
FONT_SUBTITLE = ("Arial", 20, "bold")
FONT_NORMAL = ("Arial", 15)
FONT_SMALL = ("Arial", 13)
FONT_RESULT = ("Arial", 26, "bold")
FONT_FORMULA = ("Arial", 18, "bold")

PAD_X = 18
PAD_Y = 12


def configure_theme():
    ctk.set_appearance_mode("dark")
    ctk.set_default_color_theme("dark-blue")

    theme = ctk.ThemeManager.theme
    theme["CTkFrame"]["fg_color"] = ["#1c1c1e", "#1c1c1e"]
    theme["CTkButton"]["fg_color"] = ["#ff9f0a", "#ff9f0a"]
    theme["CTkButton"]["hover_color"] = ["#d98200", "#d98200"]
    theme["CTkButton"]["text_color"] = ["#111111", "#111111"]
    theme["CTkEntry"]["fg_color"] = ["#303033", "#303033"]
    theme["CTkEntry"]["border_color"] = ["#4a4a4d", "#4a4a4d"]
    theme["CTkEntry"]["text_color"] = ["#f5f5f7", "#f5f5f7"]
    theme["CTkTextbox"]["fg_color"] = ["#1c1c1e", "#1c1c1e"]
    theme["CTkTextbox"]["border_color"] = ["#3a3a3c", "#3a3a3c"]
    theme["CTkTabview"]["fg_color"] = ["#101012", "#101012"]
    theme["CTkTabview"]["segmented_button_fg_color"] = ["#2c2c2e", "#2c2c2e"]
    theme["CTkTabview"]["segmented_button_selected_color"] = ["#ff9f0a", "#ff9f0a"]
    theme["CTkTabview"]["segmented_button_selected_hover_color"] = ["#d98200", "#d98200"]
