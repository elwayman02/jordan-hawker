// Applies a saved color theme before first paint (see app/components/theme-toggle.gts)
try {
  const theme = localStorage.getItem("theme");
  if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;
} catch {
  // storage unavailable: follow the system preference
}
