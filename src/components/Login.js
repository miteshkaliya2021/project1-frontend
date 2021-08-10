import React, { useState } from "react";
import axios from "axios";
import { setUserSession } from "../utils/Common";
import { GoogleLogin } from "react-google-login";

function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput("");
  const password = useFormInput("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/users/signin", {
        username: username.value,
        password: password.value,
      });
      setLoading(false);
      setUserSession(response.data.token, response.data.user);
      props.history.push("/dashboard");
      setLoading(false);
    } catch (error) {
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    }
  };
  const responseGoogle = (response) => {
    setUserSession(response.tokenId, response.profileObj);
    props.history.push("/dashboard");
  };

  return (
    <div>
      Login
      <br />
      <br />
      <div>
        Username
        <br />
        <input type="text" {...username} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Password
        <br />
        <input type="password" {...password} autoComplete="new-password" />
      </div>
      {error && (
        <>
          <small style={{ color: "red" }}>{error}</small>
          <br />
        </>
      )}
      <br />
      <input
        type="button"
        value={loading ? "Loading..." : "Login"}
        onClick={handleLogin}
        disabled={loading}
      />
      <br />
      <br />
      <br />
      <GoogleLogin
        clientId="601317836429-l56iblbmpetet2a5j4toabfjk955oq6k.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
      />
      ,
    </div>
  );
}

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

export default Login;
