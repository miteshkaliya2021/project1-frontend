import React from "react";
import { getUser, removeUserSession } from "../utils/Common";

function Dashboard(props) {
  const user = getUser();

  const handleLogout = () => {
    removeUserSession();
    props.history.push("/login");
  };

  return (
    <div style={{ textAlign: "center" }}>
      Welcome {user.name}!<br />
      <br />
      <input type="button" onClick={handleLogout} value="Logout" />
    </div>
  );
}

export default Dashboard;
