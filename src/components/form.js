import React, { useEffect, useState } from "react";
import axios from "axios";

const Form = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [file, setFile] = React.useState("");

  const fetchUser = async (id) => {
    try {
      const user = await axios(`http://localhost:4000/user/${id}`);
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
      // const formData = new FormData(file);
      // formData.append("profileImg", file);
      const response = await axios.post(
        "http://localhost:4000/create-user",

        {
          name: name,
          email: email,
          // profileImg: formData,
        }
      );
      console.log(response, "response");
      props.history.push("/dashboard");
      // axios
      //   .post("http://localhost:8000/user-profile", formData, {})
      //   .then((res) => {
      //     console.log(res);
      //   });
    } catch (error) {
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:4000/user/${id}`, {
        name: name,
        email: email,
      });
      props.history.push("/dashboard");
    } catch (error) {
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    }
  };

  const ImageThumb = ({ image }) => {
    return <img src={URL.createObjectURL(image)} alt={image.name} />;
  };
  const handleFile = (event) => {
    setFile(event.target.files[0]);
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profileImg", file);
    axios
      .post("http://localhost:4000/user-profile", formData, {})
      .then((res) => {
        console.log(res);
      });
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
      <br />
      <div>
        Upload Profile Pic
        <br />
        <input type="file" onChange={handleFile} />
        <p>Filename: {file.name}</p>
        <p>File type: {file.type}</p>
        <p>File size: {file.size} bytes</p>
        {file && <ImageThumb image={file} />}
        <button type="submit" onClick={handleUpload}>
          Upload
        </button>
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
