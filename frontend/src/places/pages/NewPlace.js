import React from "react";
import Input from "../../shared/components/FormElements/Input";
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";

import './PlaceForm.css';


export default function NewPlace() {
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
    }
  }, false);
  

  function submitHandler(event) {
    event.preventDefault();
    console.log(formState.inputs);
  }
  return (
    <form className="place-form" onSubmit={submitHandler}>
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
      <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
    </form>
  )
}