import React, { useState } from "react";
import validator from "validator";

const SignIn = ({ onRouteChange, getUserData }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMessage] = useState("");

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const onSubmitUser = async () => {
    if (!validator.isEmail(email) && email.length > 0) {
      setErrMessage("Invalid Email Format");
      setEmail("");
      return;
    } else if (!validator.isLength(password, { min: 5 })) {
      setErrMessage("Too Short Password");
      setPassword("");
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/signin", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (response.ok) {
        const user = await response.json();
        getUserData(user);
        onRouteChange("home");
      } else {
        setErrMessage("User does not exist");
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        <div className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email-address">
                Email
              </label>
              <input
                onChange={onEmailChange}
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                name="email-address"
                id="email-address"
                value={email}
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">
                Password
              </label>
              <input
                onChange={onPasswordChange}
                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                name="password"
                id="password"
                value={password}
              />
            </div>
          </fieldset>
          <div className="">
            <input
              onClick={onSubmitUser}
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="submit"
              value="Sign in"
            />
          </div>
          <div className="lh-copy mt3">
            <p
              onClick={() => onRouteChange("register")}
              className="f6 link dim black db pointer"
            >
              Register
            </p>

            <p className="f3 red db">{errMsg}</p>
          </div>
        </div>
      </main>
    </article>
  );
};

export default SignIn;
