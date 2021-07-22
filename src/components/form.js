import React, { useEffect, useState } from "react";
import axios from "axios";

const Form = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  console.log(props.match.params.id, "id");

  const fetchUser = async (id) => {
    try {
      const user = await axios(`http://localhost:5000/user/${id}`);
      console.log(user.data);
      setEmail(user.data.email);
      setName(user.data.name);
    } catch (error) {
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong.Please try again later.");
    }
  };
  useEffect(() => {
    if (props.match.params.id) fetchUser(props.match.params.id);
  }, [props.match.params.id]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/create-user", {
        name: name,
        email: email,
      });
      console.log(response, "response");
      props.history.push("/dashboard");
    } catch (error) {
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/user/${id}`, {
        name: name,
        email: email,
      });
      props.history.push("/dashboard");
    } catch (error) {
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    }
  };
  return (
    <div>
      {props.match.params.id ? <h3>Edit Person</h3> : <h3>Add Person</h3>}
      <div>
        Name:
        <br />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <br />
      <div>
        Email:
        <br />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <br />
        <button
          onClick={() =>
            props.match.params.id
              ? handleUpdate(props.match.params.id)
              : handleSubmit()
          }
        >
          Save
        </button>
        <button onClick={() => props.history.push("/dashboard")}>Cancel</button>
      </div>
      {error && (
        <>
          <small style={{ color: "red" }}>{error}</small>
          <br />
        </>
      )}
    </div>
  );
};
const useFormInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};
export default Form;
