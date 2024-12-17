import { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, PageNotFound } from "./screens";
import Sample from "./screens/sample/Sample";
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from "./screens/Authentication/Auth";
import { Toaster } from 'react-hot-toast';
import ListDoctor from "./screens/doctor/ListDoctor";
import ListPatients from "./screens/patient/ListPatients";
import ListTechnicians from "./screens/technician/ListTechnicians";
import ListTests from "./screens/test/ListTests";
import ListResults from "./screens/result/ListResults";
import ResultAdd from "./screens/result/ResultAdd";
function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // adding dark-mode class if the dark mode is set on to the body tag
  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  return (
    <>
    <Toaster/>
      <Router>
        <Routes>
          <Route element={<BaseLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sample" element={<Sample />} />
            <Route path="/list_doctors" element={<ListDoctor />} />
            <Route path="/list_patients" element={<ListPatients />} />
            <Route path="/list_technicians" element={<ListTechnicians />} />
            <Route path="/list_tests" element={<ListTests />} />
            <Route path="/list_results" element={<ListResults />} />
            <Route path="/add_result" element={<ResultAdd />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
          <Route path="/" element={<Auth />} />
          <Route path="/register" element={<Auth insideRegister />} />
        </Routes>

        {/* <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
        >
          <img
            className="theme-icon"
            src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
          />
        </button> */}
      </Router>
    </>
  );
}

export default App;
