import React, { useState } from "react";
import "./App.css";
import Navigation from "./Components/Navigation/Navigation";
import Logo from "./Components/Logo/Logo";
import ImageLinkFrom from "./Components/ImageLinkFrom/ImageLinkFrom";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import Rank from "./Components/Rank/Rank";
import ParticlesBg from "particles-bg";

function App() {
  const [input, setInput] = useState("");
  const [img, setImg] = useState("");

  const getImageReq = (img) => {
    const PAT = "57643cc08f004cc1902541cb9266b860";
    const USER_ID = "maxim";
    const APP_ID = "face-reco";
    const IMAGE_URL = img.toString();

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: IMAGE_URL,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };

    return requestOptions;
  };

  const OnInputChange = (event) => {
    setInput(event.target.value);
  };

  const onButtonSubmit = () => {
    setImg(input);
    fetch(
      "https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs",
      getImageReq(input)
    )
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="App">
      <ParticlesBg type="cobweb" bg={true} />
      <Navigation search />
      <Logo />
      <Rank />
      <ImageLinkFrom
        inputChange={OnInputChange}
        buttonSubmit={onButtonSubmit}
      />
      <FaceRecognition imgSrc={img} />
    </div>
  );
}

export default App;
