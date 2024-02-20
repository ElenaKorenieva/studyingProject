import React, { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../../API/API";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserName = async () => {
      try {
        const token = localStorage.getItem("jwt");

        const response = await axios.get(`${baseURL}/user`, {
          withCredentials: true,
          headers: {
            "X-CSRFToken": cookies.get("csrftoken"),
            "Content-Type": "application/json",
            Accept: "Application/json",
            "Access-Control-Allow-Credentials": true,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getUserName();
  }, []);

  return (
    <div>
      <h1>HomePage</h1>
      {user ? (
        <h2>
          Welcome : <span>{user}</span>
        </h2>
      ) : null}
    </div>
  );
}
