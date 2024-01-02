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
  const [imgBorder, setImageBorder] = useState({})

  const getImageReq = (img) => {
    const PAT = "57643cc08f004cc1902541cb9266b860";
    const USER_ID = "maxim";
    const APP_ID = "face-reco";
    const IMAGE_URL = img;

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

  const calculateFaceLocation = (data) => {
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height,data);
    console.log(data.bottom_row * height);

    const border = {
      leftCol: data.left_col * width,
      topRow: data.top_row * height,
      rightCol: width - (data.right_col * width),
      bottomRow: height - (data.bottom_row * height)
    }

    console.log(border);

    return border
  }

  const OnInputChange = (event) => {
    setInput(event.target.value);
  };

  const displayBox = (box) => {
    setImageBorder(box);
  }

  const onButtonSubmit = () => {
    setImg(input);
    fetch(
      "https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs",
      getImageReq(input)
    )
      .then((response) => response.json())
      .then((result) => {console.log(result); return displayBox(calculateFaceLocation(result.outputs[0].data.regions[0].region_info.bounding_box))})
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
      <FaceRecognition imageUrl={img} box={imgBorder} />
    </div>
  );
}

export default App;
