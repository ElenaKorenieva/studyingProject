import React, { useState } from "react";
import s from "./Register.module.scss";
import axios from "axios";
import baseURL from "../../API/API";
// import { useNavigate } from "react-router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState();
  //   const navigate = useNavigate();

  const submitLogin = (e) => {
    e.preventDefault();
    setErr("");
    let data = {
      name: name,
      email: email,
      password: password,
    };
    if (name !== "" && email !== "" && password !== "") {
      axios
        .post(`${baseURL}/register`, data, { withCredentials: true })
        .then((result) => {
          console.log(result);
          localStorage.setItem("jwt", result.data.jwt);
          //   navigate("/");
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
    <div className={s.registerContainer}>
      <form onSubmit={submitLogin} className={s.registerForm}>
        <input
          className={s.registerField}
          type="text"
          placeholder="Username"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          className={s.registerField}
          type="email"
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className={s.registerField}
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          type="submit"
          value="SignUp"
          onSubmit={submitLogin}
          className={s.regiserBtn}
        />
      </form>
      <h5 className={s.errMsg}>{err ? err : null}</h5>
    </div>
  );
}
