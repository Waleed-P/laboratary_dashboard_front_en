import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { LIGHT_THEME } from "../../constants/themeConstants";
import Logo from "../../assets/images/logo.png";
import LogoBlue from "../../assets/images/logo_blue.svg";
import LogoWhite from "../../assets/images/logo_white.svg";
import {
  MdOutlineClose,
  MdOutlineGridView,
  MdOutlineLogout,
} from "react-icons/md";
import { FaUserDoctor,FaUserInjured ,FaUserAstronaut,FaFlask , FaRegRectangleList} from "react-icons/fa6";

import { Link } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);

  // closing the navbar when clicked outside the sidebar area
  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-oepn-btn"
    ) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isActive, setIsActive] = useState(1);
  const handleActiveState = (state) => {
    setIsActive(state);
  };

  return (
    <nav
      className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
      ref={navbarRef}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img src={Logo} alt="" height="50" />
          <span className="sidebar-brand-text mt-2">Genex Lab</span>
        </div>
        <button className="sidebar-close-btn" onClick={closeSidebar}>
          <MdOutlineClose size={24} />
        </button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <ul className="menu-list">
            <li className="menu-item">
              <Link
                to="/dashboard"
                onClick={() => {
                  handleActiveState(1);
                }}
                className={`menu-link ${isActive === 1 ? "active" : ""}`}
                style={{ textDecoration: "none" }}
              >
                <span className="menu-link-icon">
                  <MdOutlineGridView size={18} />
                </span>
                <span className="menu-link-text">Dashboard</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/list_doctors"
                onClick={() => {
                  handleActiveState(2);
                }}
                className={`menu-link ${isActive === 2 ? "active" : ""}`}
                style={{ textDecoration: "none" }}
              >
                <span className="menu-link-icon">
                  <FaUserDoctor size={20} />
                </span>
                <span className="menu-link-text">Doctors</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/list_patients"
                onClick={() => {
                  handleActiveState(3);
                }}
                className={`menu-link ${isActive === 3 ? "active" : ""}`}
                style={{ textDecoration: "none" }}
              >
                <span className="menu-link-icon">
                  <FaUserInjured size={20} />
                </span>
                <span className="menu-link-text">Patients</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/list_technicians"
                onClick={() => {
                  handleActiveState(4);
                }}
                className={`menu-link ${isActive === 4 ? "active" : ""}`}
                style={{ textDecoration: "none" }}
              >
                <span className="menu-link-icon">
                  <FaUserAstronaut size={20} />
                </span>
                <span className="menu-link-text">Technicians</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/list_tests"
                onClick={() => {
                  handleActiveState(5);
                }}
                className={`menu-link ${isActive === 5 ? "active" : ""}`}
                style={{ textDecoration: "none" }}
              >
                <span className="menu-link-icon">
                <FaFlask size={20} />
                </span>
                <span className="menu-link-text">Test</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                to="/list_results"
                onClick={() => {
                  handleActiveState(6);
                }}
                className={`menu-link ${isActive === 6 ? "active" : ""}`}
                style={{ textDecoration: "none" }}
              >
                <span className="menu-link-icon">
                  <FaRegRectangleList size={20} />
                </span>
                <span className="menu-link-text">Results</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-menu sidebar-menu2">
          <ul className="menu-list">
            <li className="menu-item">
              <Link to="/" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineLogout size={20} />
                </span>
                <span className="menu-link-text">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
