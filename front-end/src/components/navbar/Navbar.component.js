import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { isLoggedIn } from "../../actions/auth";
import { APP_NAME } from "../../config";
import "./Navbar.css";

const Navbar = (router) => {
  const [url, setUrl] = useState();

  useEffect(() => {
    if (router.location.pathname === url) return;

    setUrl(router.location.pathname);
    // eslint-disable-next-line
  }, [router]);

  return (
    <nav className="nav-container">
      <Link to="/" className="nav-items">
        {APP_NAME}
      </Link>
      <div className="nav-items">
        {isLoggedIn() ? (
          <>
            <Link className="nav-link" to="/user/logout">
              Logout
            </Link>
            <Link
              className="nav-link"
              to={`/list/${localStorage.getItem("name")}`}
            >
              Birthday List
            </Link>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/user/login">
              Login
            </Link>
            <Link className="nav-link" to="/user/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default withRouter(Navbar);
