import axios from "axios";
import React, { useEffect, useState } from "react";
import { getUser, removeUserSession } from "../utils/Common";

const Dashboard = (props) => {
  const [userList, setUserList] = useState([]);
  const user = getUser();
  const [error, setError] = useState(null);

  const handleLogout = () => {
    removeUserSession();
    props.history.push("/login");
  };

  const fetchUser = async () => {
    try {
      const users = await axios("http://localhost:5000/get-users");
      setUserList(users.data.user);
    } catch (error) {
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/user/${id}`);
      fetchUser();
    } catch (error) {
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      Welcome {user.name}!<br />
      <br />
      <button onClick={() => props.history.push("/form")}>Add Person</button>
      <table>
        <tbody>
          <tr>
            <td>Name</td>
            <td>email</td>
            <td>Action</td>
          </tr>
          {userList &&
            userList.map((user) => {
              return (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      onClick={() => props.history.push(`/form/${user._id}`)}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(user._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <input type="button" onClick={handleLogout} value="Logout" />
    </div>
  );
};

export default Dashboard;
