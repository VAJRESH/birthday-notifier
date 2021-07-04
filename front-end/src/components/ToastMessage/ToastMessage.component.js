import React, { useEffect, useState } from "react";
import "./ToastMessage.css";

const ToastMessage = ({ message }) => {
  const [msg, setMsg] = useState(message);

  useEffect(() => {
    setMsg(message);
    const timer = setTimeout(() => {
      setMsg("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [message]);

  return <>{msg && <small className="toast-box">{msg}</small>}</>;
};

export default ToastMessage;
