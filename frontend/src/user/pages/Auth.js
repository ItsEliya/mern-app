import React, { useContext, useState } from "react";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UI/Card";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import './Auth.css';
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";


export default function Auth() {
  const authCtx = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: '',
      isValid: false
    },
    password: {
      value: '',
      isValid: false
    }
  }, false);

  function switchModeHandler() {
    if (!isLoginMode) {
      setFormData({
        ...formState.inputs,
        name: undefined
      }, formState.inputs.email.isValid && formState.inputs.password.isValid)
    } else {
      setFormData({
        ...formState.inputs,
        name: {
          value: '',
          isValid: false
        }
      }, false)
    }
    setIsLoginMode((prev) => !prev);
  }
  async function submitHandler(event) {
    event.preventDefault();
    if (isLoginMode) {

    } else {
      try {
        const response = await fetch("http://localhost:5000/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          })
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    authCtx.login();
  }
  return (
    <Card className="authentication">
      <h2>Login</h2>
      <hr />
      <form onSubmit={submitHandler}>
        {!isLoginMode &&
          <Input
            element="input"
            id="name"
            type="text"
            label="Your Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name."
            onInput={inputHandler}
          />}
        <Input
          id="email"
          element="input"
          type="email"
          label="Email"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please provide a valid email address."
          onInput={inputHandler}
        />
        <Input
          id="password"
          element="input"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please provide a valid password (at least 5 characters)."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>{isLoginMode ? 'LOGIN' : 'SIGNUP'}</Button>
      </form>
      <Button inverse onClick={switchModeHandler}>SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
    </Card>
  )
}