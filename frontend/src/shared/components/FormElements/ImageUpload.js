import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";

import './ImageUpload.css';

export default function ImageUpload(props) {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const imageUploadRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    }
    fileReader.readAsDataURL(file);
  }, [file])
  function afterPickHandler(event) {
    let image;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      image = event.target.files[0];
      setFile(image);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, image, fileIsValid);
  }
  function pickImageHandler() {
    imageUploadRef.current.click();
  }
  return (
    <div className="form-control">
      <input onChange={afterPickHandler} ref={imageUploadRef} id={props.id} style={{display: "none"}} accept=".jpg,.png,.jpeg" type="file"/>
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview"/>}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  )
}