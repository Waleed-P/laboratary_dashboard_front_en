import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { SidebarProvider } from "./context/SidebarContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <SidebarProvider>
      <GoogleOAuthProvider clientId="536959634199-v6a1js2pbt23nqvlrs5ljbgsq5mgr8rg.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </SidebarProvider>
  </ThemeProvider>
);
