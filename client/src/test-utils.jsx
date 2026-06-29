import { render } from "@testing-library/react";
import { AppProvider } from "./contexts/AppContext.jsx";
import { languages } from "./i18n.js";

const customRender = (ui, options = {}) => {
  const {
    copy = languages.he,
    currentUser = { sub: "u1", role: "student" },
    ...renderOptions
  } = options;
  return render(ui, {
    wrapper: ({ children }) => (
      <AppProvider copy={copy} currentUser={currentUser}>
        {children}
      </AppProvider>
    ),
    ...renderOptions
  });
};

export * from "@testing-library/react";
export { customRender as render };
