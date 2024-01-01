import React from "react";

const FaceRecognition = ({imgSrc}) => {
  return (
    <div className="center ma">
    <div className="absoulute mt2">
      {imgSrc && <img style={{maxHeight:"600px"}} alt="facereco" src={imgSrc} width='500px' height='auto' />}
      </div>
    </div>
  );
};

export default FaceRecognition;
