import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// List of DaisyUI themes you want to allow
const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "cyberpunk",
  "emerald",
  "retro",
  "corporate",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    return localStorage.getItem("theme") || "light";
  };

  const [theme, setThemeState] = useState(getInitialTheme);

  // Apply and store theme
  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Update theme and persist it
  const setTheme = (newTheme) => {
    if (themes.includes(newTheme)) {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeSelector = () => {
  const { theme, setTheme, themes } = useTheme();

  return (
    <select
      className="select select-bordered min-w-1/3"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
    >
      {themes.map((theme) => (
        <option key={theme} value={theme}>
          {theme}
        </option>
      ))}
    </select>
  );
};

export const useTheme = () => useContext(ThemeContext);
