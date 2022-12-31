import React, { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import Card from "../../shared/components/UI/Card";
import './PlaceForm.css';
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner";
import ErrorModal from "../../shared/components/UI/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

export default function UpdatePlace() {
  const placeId = useParams().placeId;
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [place, setPlace] = useState(null);
  const [formState, inputChangeHandler, setFormData] = useForm({
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    }
  }, false);
  useEffect(() => {
    async function fetchPlace() {
      try {
        const data = await sendRequest(`http://localhost:5000/api/places/${placeId}`);
        setPlace(data.place);
        setFormData({
          title: {
            value: data.place.title,
            isValid: true
          },
          description: {
            value: data.place.description,
            isValid: true
          }
        }, true);
      } catch (error) {}
    }
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);
  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    )
  }
  if (!place && !error) {
    return (
      <div className="center">
        <Card>
          <h2>couldnt find place!</h2>
        </Card>
      </div>
    )
  }

  async function submitHandler(event) {
    event.preventDefault();
    try {
      await sendRequest(`http://localhost:5000/api/places/${placeId}`, "PATCH", JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value
        }),
        {
          "Content-Type": "application/json"
        }
      );
      navigate("/" + authCtx.userId + "/places");
    } catch (error) {
      
    }
  }
  
  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      {!isLoading && place && <form className="place-form" onSubmit={submitHandler}>
        <Input 
          id="title" 
          element="input" 
          type="text" 
          label="Title" 
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputChangeHandler}
          initialValue={place.title}
          initialValid={true}
        />
        <Input 
          id="description" 
          element="textarea" 
          label="Description" 
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (min 5 characters)."
          onInput={inputChangeHandler}
          initialValue={place.description}
          initialValid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
      </form>}
    </Fragment>
  )
}