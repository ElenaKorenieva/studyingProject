import React from "react";
import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userName");
    window.location.href = "/login";
  });

  return <div>Logout</div>;
}
