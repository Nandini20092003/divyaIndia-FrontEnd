// Header
import React, { useRef, useEffect, useContext } from "react";
import { Container, Row, Button } from "reactstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./header.css";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/config";

const navLinks = [
  { path: "/home", display: "Home" },
  { path: "/heritageSites", display: "HeritageSites" },
  { path: "/travel", display: "Travel" },
  { path: "/tours", display: "Tours" },
  { path: "/quiz", display: "Quiz" },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  const logout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Clear the local session even if the network is unavailable.
    } finally {
      dispatch({ type: "LOGOUT" });
      navigate("/");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      const isSticky = window.scrollY > 80;
      headerRef.current.classList.toggle("sticky__header", isSticky);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    menuRef.current?.classList.toggle("show__menu");
  };

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
            <div className="logo"><img src={logo} alt="DivyaIndia logo" /></div>
            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <ul className="menu d-flex align-items-center gap-5">
                {navLinks.map((item) => (
                  <li className="nav__item" key={item.path}>
                    <NavLink to={item.path} className={({ isActive }) => isActive ? "active__link" : ""}>
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="nav__right d-flex align-items-center gap-4">
              <div className="nav__btns d-flex align-items-center gap-4">
                {user ? (
                  <>
                    <h5 className="mb-0">{user.username}</h5>
                    <Button className="btn btn-dark" onClick={logout}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Button className="btn secondary__btn"><Link to="/login">Login</Link></Button>
                    <Button className="btn primary__btn"><Link to="/register">Register</Link></Button>
                  </>
                )}
              </div>
              <span className="mobile__menu" onClick={toggleMenu}>
                <i className="ri-menu-line"></i>
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
