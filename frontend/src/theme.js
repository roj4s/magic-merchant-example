export const colors = {
  success: "#e6f7ec",
  background: "#1a1a1a",
  secondary: "#09BD67",
  secondaryLighter: "#c5ee4e",
  secondaryLighter2: "#c5ee4c",
  secondaryLighter3: "#c5eb3b",
  secondaryLighter4: "#c5ef1a",
  primary: "#efefef",
  textPrimary: "#373F50",
  textSecondary: "#7D879C",
  textActive: "#ffffff",
  backgroundSecondary: "#1a1a1a",
  appbar: "#818a95",
};

export const themes = {
  default: {
    colors: colors,
  },
};

export const currentThemeKey = "default";

export const currentTheme = themes[currentThemeKey];
