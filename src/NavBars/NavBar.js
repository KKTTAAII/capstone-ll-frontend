import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  Navbar,
  Nav,
  NavItem,
  NavbarBrand,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import UserInfoContext from "../common/UserInfoContext";
import "../css/Navbar.css";

const NavBar = ({ logOut }) => {
  const { user } = useContext(UserInfoContext);
  let href;
  let navBar;

  if (user && user.userType === "shelters") {
    href = "/shelters";
    navBar = (
      <Collapse navbar className="nav-loggedIn">
        <Nav className="ms-auto">
          <NavItem>
            <NavLink to={`/adoptableDogs`} className="nav-loggedinLink">
              All Dogs
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink to={`/shelters`} className="nav-loggedinLink">
              All Shelters
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              to={`/shelters/add/${user.id}`}
              className="nav-loggedinLink"
            >
              Add Pet
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              to={`/shelters/remove/${user.id}`}
              className="nav-loggedinLink"
            >
              Remove Pet
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              to={`/shelters/profile/${user.id}`}
              className="nav-loggedinLink"
            >
              Profile
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink to="/" onClick={logOut} className="nav-loggedinLink">
              Log out
            </NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    );
  } else if (user && user.userType === "adopters") {
    href = "/adoptableDogs";
    navBar = (
      <Collapse navbar>
        <Nav className="ms-auto">
          <NavItem>
            <NavLink to={`/adoptableDogs`} className="nav-loggedinLink">
              All Dogs
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink to={`/shelters`} className="nav-loggedinLink">
              All Shelters
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              to={`/adopters/favorites/${user.username}`}
              className="nav-loggedinLink"
            >
              My Favorites
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              to={`/adopters/profile/${user.username}`}
              className="nav-loggedinLink"
            >
              Profile
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink to="/" onClick={logOut} className="nav-loggedinLink">
              Log out
            </NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    );
  } else {
    href = "/";
  }

  return (
    <div className="NavBar">
      <Navbar expand="md" light color="light" fixed="top">
        <NavbarBrand exact="true" href={href}>
          Petly
        </NavbarBrand>

        {user ? (
          navBar
        ) : (
          <Collapse navbar className="nav-loggedOut">
            <Nav className="ms-auto">
              <UncontrolledDropdown inNavbar nav>
                <DropdownToggle caret nav id="navbar-dropdown">
                  Shelter
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem>
                    <NavLink to="/shelters/login" className="navbar-link">
                      Log in
                    </NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink to="/shelters/signup" className="navbar-link">
                      Sign up
                    </NavLink>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              <UncontrolledDropdown inNavbar nav>
                <DropdownToggle caret nav id="navbar-dropdown">
                  Adopter
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem>
                    <NavLink to="/adopters/login" className="navbar-link">
                      Log in
                    </NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink to="/adopters/signup" className="navbar-link">
                      Sign up
                    </NavLink>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        )}
      </Navbar>
    </div>
  );
};

export default NavBar;
