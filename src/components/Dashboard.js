import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { getUser, removeUserSession } from "../utils/Common";

const Dashboard = (props) => {
  const [userList, setUserList] = useState([]);
  const user = getUser();
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sortedItems = useMemo(() => {
      let sortableItems = [...items];
      if (sortConfig !== null) {
        sortableItems.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        });
      }
      return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
      let direction = "ascending";
      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === "ascending"
      ) {
        direction = "descending";
      }
      setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort };
  };
  const { items, requestSort } = useSortableData(userList);

  const handleLogout = () => {
    removeUserSession();
    props.history.push("/login");
  };

  const fetchUser = async () => {
    try {
      const users = await axios("http://localhost:4000/get-users");
      setUserList(users.data.user);
    } catch (error) {
      console.log(error, "error");
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/user/${id}`);
      fetchUser();
    } catch (error) {
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    }
  };
  const handleSearchChange = (e) => {
    if (e.target.value === "") {
      return userList;
    }

    const post = userList.filter((item) =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setUserList(post);
  };

  return (
    <div style={{ textAlign: "center" }}>
      Welcome {user.name}!<br />
      <br />
      <button
        style={{
          margin: "10px",
        }}
        onClick={() => props.history.push("/form")}
      >
        Add Person
      </button>
      <input
        type="search"
        onChange={(e) => setSearchTerm(e.target.value)}
        name="s"
        id="s"
        placeholder="Search"
      />
      <table>
        <tbody>
          <tr>
            <td>
              <button
                style={{
                  background: "white",
                  outline: "none",
                  border: "none",
                  fontSize: "14px",
                }}
                type="button"
                onClick={() => requestSort("name")}
              >
                Name{" "}
              </button>
            </td>
            <td>
              {" "}
              <button
                style={{
                  background: "white",
                  outline: "none",
                  border: "none",
                  fontSize: "14px",
                }}
                type="button"
                onClick={() => requestSort("email")}
              >
                Email{" "}
              </button>
            </td>
            <td>Action</td>
          </tr>
          {items &&
            items
              .filter((val) => {
                if (setSearchTerm === "") {
                  return val;
                } else if (
                  val.name.toLowerCase().includes(searchTerm.toLowerCase())
                ) {
                  return val;
                }
              })
              .map((user) => {
                return (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        style={{
                          margin: "10px",
                          background: "gray",
                          color: "white",
                        }}
                        onClick={() => props.history.push(`/form/${user._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        style={{
                          margin: "10px",
                          background: "red",
                          color: "white",
                        }}
                        onClick={() => handleDelete(user._id)}
                      >
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
