import React, { useEffect, useState } from "react";
import s from "./Header.module.scss";
import { Link } from "react-router-dom";

export default function Header() {
  const [token, setToken] = useState();

  useEffect(() => {
    setToken(localStorage.getItem("jwt"));
  }, []);

  return (
    <header className={s.header}>
      <h2>SuperPuper APP</h2>
      {token ? (
        <>
          <Link to="/logout" className={s.headerLink}>
            Logout
          </Link>
        </>
      ) : (
        <>
          <Link to="/login" className={s.headerLink}>
            Login
          </Link>
        </>
      )}
    </header>
  );
}
