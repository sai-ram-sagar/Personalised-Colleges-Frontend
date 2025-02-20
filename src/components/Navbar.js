import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUniversity, faStar, faCog, faSignOutAlt, faLightbulb, faBars } from "@fortawesome/free-solid-svg-icons";
import appLogo from "../assets/images/app_logo.png";

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/home");
    if (window.innerWidth <= 1024) {
      setMenuOpen(false);
    }
  };

  const handleNavItemClick = () => {
    if (window.innerWidth <= 1024) {
      setMenuOpen(false);
    }
  };

  return (
    <NavBar>
      <LogoContainer onClick={handleLogoClick}>
        <img src={appLogo} alt="logo" />
      </LogoContainer>
      <MenuIcon onClick={() => setMenuOpen(!menuOpen)}>
        <FontAwesomeIcon icon={faBars} />
      </MenuIcon>
      <Links menuOpen={menuOpen}>
        <NavItem to="/home" onClick={handleNavItemClick}>
          <FontAwesomeIcon icon={faHome} /> Home
        </NavItem>
        <NavItem to="/colleges" onClick={handleNavItemClick}>
          <FontAwesomeIcon icon={faUniversity} /> Colleges
        </NavItem>
        <NavItem to="/recommend" onClick={handleNavItemClick}>
          <FontAwesomeIcon icon={faLightbulb} /> Recommendations
        </NavItem>
        <NavItem to="/preferences" onClick={handleNavItemClick}>
          <FontAwesomeIcon icon={faCog} /> Preferences
        </NavItem>
        <NavItem to="/favorites" onClick={handleNavItemClick}>
          <FontAwesomeIcon icon={faStar} /> Favorites
        </NavItem>
        <LogoutButton onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </LogoutButton>
      </Links>
    </NavBar>
  );
};

const NavBar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: calc(100vw - 40px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #191970;
  color: white;
  height: 10vh;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  img {
    width: 280px;

    @media (max-width: 1024px) {
      width: 180px;
    }

    /* @media (max-width: 768px) {
      width: 150px;
    } */
  }
`;

const MenuIcon = styled.div`
  display: none;
  font-size: 24px;
  cursor: pointer;

  @media (max-width: 1024px) {
    display: block;
  }
`;

const Links = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    width: 50%;
    max-width: 250px;
    position: absolute;
    top: 12vh;
    right: 10px;
    background: #191970;
    display: ${(props) => (props.menuOpen ? "flex" : "none")};
    padding: 15px 0;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    width: 65%;
    max-width: 200px;
  }
`;

const NavItem = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  transition: background 0.3s ease;
  border-radius: 5px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const LogoutButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 5px;
  transition: background 0.3s ease;

  &:hover {
    background-color: #c82333;
  }
`;

export default Navbar;
