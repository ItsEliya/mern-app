import React, { Fragment, useContext } from "react";
import Input from "../../shared/components/FormElements/Input";
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";

import './PlaceForm.css';
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";


export default function NewPlace() {
  const navigate = useNavigate();
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const authCtx = useContext(AuthContext);
  const [formState, inputHandler] = useForm({
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
    address: {
      value: '',
      isValid: false
    },
    image: {
      value: null,
      isValid: false
    }
  }, false);
  

  async function submitHandler(event) {
    event.preventDefault();
    try { 
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(process.env.REACT_APP_BACKEND_URL + "/api/places", "POST", formData, {
        Authorization: "Bearer " + authCtx.token
      });
      navigate("/");
    } catch (error) {
      
    }
  }
  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      <form className="place-form" onSubmit={submitHandler}>
        {isLoading && <LoadingSpinner asOverlay/>}
        <Input 
          id="title"
          element='input' 
          type='text' 
          label='Title' 
          errorText="Please enter a valid title." 
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <Input 
          id="address"
          element='input' 
          type='text' 
          label='Address' 
          errorText="Please enter a valid address." 
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <Input 
          id="description"
          element='textarea' 
          label='Description' 
          errorText="Please enter a valid description (at least 5 characters)." 
          validators={[VALIDATOR_MINLENGTH(5)]}
          onInput={inputHandler}
        />
        <ImageUpload id="image" onInput={inputHandler} errorText="Please provide an image."/>
        <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
      </form>
    </Fragment>
  )
}