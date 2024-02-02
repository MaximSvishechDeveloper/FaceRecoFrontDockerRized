import React, { useState } from "react";
import "./App.css";
import Navigation from "./Components/Navigation/Navigation";
import Logo from "./Components/Logo/Logo";
import ImageLinkFrom from "./Components/ImageLinkFrom/ImageLinkFrom";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import Rank from "./Components/Rank/Rank";
import SignIn from "./Components/SignIn/SignIn";
import Register from "./Components/Register/Register";
import ParticlesBg from "particles-bg";

function App() {
  const [input, setInput] = useState("");
  const [img, setImg] = useState("");
  const [imgBorder, setImageBorder] = useState({});
  const [route, SetRoute] = useState("signIn");
  const [isSignedIn, SetSignedIn] = useState(false);
  const [user, setUser] = useState({});
  const [errMsg, setErrMessage] = useState("");

  const calculateFaceLocation = (data) => {
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);

    const border = data.map((result, index) => {
      return {
        key: index,
        leftCol: result.region_info.bounding_box.left_col * width,
        topRow: result.region_info.bounding_box.top_row * height,
        rightCol: width - result.region_info.bounding_box.right_col * width,
        bottomRow: height - result.region_info.bounding_box.bottom_row * height,
      };
    });

    return border;
  };

  const OnInputChange = (event) => {
    setInput(event.target.value);
  };

  const displayBox = (box) => {
    setImageBorder(box);
  };

  const onRouteChange = (route) => {
    setErrMessage("");
    setImg("");
    setImageBorder({});
    SetRoute(route);
    route === "home" ? SetSignedIn(true) : SetSignedIn(false);
  };

  const onUserChange = (user) => {
    setUser(user);
  };

  const updateUserEntriesCount = async () => {
    const req = {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user.id,
      }),
    };

    try {
      const response = await fetch("http://localhost:3001/image", req);
      if (response.ok) {
        const newEntries = await response.json();
        setUser({ ...user, entries: newEntries[0].entries });
      }
    } catch (err) {
      console.log("Falied to update user");
    }
  };

  const onButtonSubmit = () => {
    const req = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: input,
      }),
    };
    setImageBorder({});
    setErrMessage("");
    if (input.length === 0) {
      setErrMessage("cant submit an empty input");
      return;
    }
    setImg(input);
    fetch("http://localhost:3001/imageUrl", req)
      .then((response) => response.json())
      .then((result) => {
        if (Object.keys(result.outputs[0].data).length === 0) {
          if (result.outputs[0].status.code === 30104) {
            setErrMessage("Too Long URL");
            return Promise.reject("Too Long URL");
          } else {
            setErrMessage("Not a face picture");
            return Promise.reject("Not a face picture");
          }
        }
        return displayBox(
          calculateFaceLocation(result.outputs[0].data.regions)
        );
      })
      .then(() => {
        setErrMessage("");
        updateUserEntriesCount();
      })
      .catch((error) => {
        console.log(error);
        setErrMessage(error);
      });
  };

  return (
    <div className="App">
      <ParticlesBg color="#FFFFFF" type="cobweb" bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === "home" ? (
        <div>
          <Logo />
          <Rank user={user} />
          <ImageLinkFrom
            inputChange={OnInputChange}
            buttonSubmit={onButtonSubmit}
          />
          <p className="f3 red db">{errMsg}</p>

          <FaceRecognition imageUrl={img} box={imgBorder} />
        </div>
      ) : route === "signIn" ? (
        <SignIn getUserData={onUserChange} onRouteChange={onRouteChange} />
      ) : (
        <Register getUserData={onUserChange} onRouteChange={onRouteChange} />
      )}
    </div>
  );
}

export default App;
