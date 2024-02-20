import React, { useState } from "react";
import s from "./Login.module.scss";
import axios from "axios";
import baseURL from "../../API/API";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState();
  //   const [cookies, setCookie] = useCookies(["jwt"]);
  //   const navigate = useNavigate();

  const submitLogin = (e) => {
    e.preventDefault();
    setErr("");
    let data = {
      email: email,
      password: password,
    };

    console.log(data);
    if (email !== "" && password !== "") {
      axios
        .post(`${baseURL}/login`, data, { withCredentials: true })
        .then((result) => {
          console.log(result);
          //   setCookie("jwt", result.data.jwt);
          localStorage.setItem("jwt", result.data.jwt);
          window.location.href = "/";

          console.log(result);
        })
        .catch((err) => {
          //   console.log(err.response);
          setErr(err.response.data);
        });
    } else {
      setErr("Email and Password are required ...");
    }
  };
  return (
    <div className={s.loginContainer}>
      <form onSubmit={submitLogin} className={s.loginForm}>
        <input
          className={s.inputField}
          type="email"
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className={s.inputField}
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          type="submit"
          value="Login"
          onSubmit={submitLogin}
          className={s.loginBtn}
        />
      </form>
      <h5 className={s.errMsg}>{err ? err : null}</h5>
      <div className={s.signUpLink}>
        Don't have an account?{" "}
        <a href="/register" className={s.link}>
          Sign Up
        </a>
      </div>
    </div>
  );
}
