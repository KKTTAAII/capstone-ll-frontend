import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import UserInfoContext from "../common/UserInfoContext";
import "./css/NavBar.css";

function NavBar({ logOut }) {
  const { user } = useContext(UserInfoContext);
  return (
    <div className="NavBar">
      <Navbar expand="md">
        <NavLink exact to="/" className="navbar-brand">
          Petly
        </NavLink>

        {user ? (
          <Nav className="ml-auto NavBar-Nav" navbar>
            <NavItem>
              <NavLink to="/companies" className="navbar-link">
                Companies
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/jobs" className="navbar-link">
                Jobs
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/profile" className="navbar-link">
                Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/" onClick={logOut} className="navbar-link">
                Log out
              </NavLink>
            </NavItem>
          </Nav>
        ) : (
          <Nav className="ml-auto NavBar-Nav" navbar>
            <NavItem>
              <NavLink to="/login" className="navbar-link">
                Log in
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/signup" className="navbar-link">
                Sign up
              </NavLink>
            </NavItem>
          </Nav>
        )}
      </Navbar>
    </div>
  );
}

export default NavBar;
