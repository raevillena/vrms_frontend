import React from "react";
import Webcam from "react-webcam";

const Camera = () => {
    const webcamRef = React.useRef(null);

    const capture = React.useCallback(
      () => {
        const imageSrc = webcamRef.current.getScreenshot();
      },
      [webcamRef]
    );

    return (
        <div>
            <Webcam
            width="100%"
            videoConstraints={{facingMode: "environment"}}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={80}
            />
        </div>
    )
}

export default Camera


