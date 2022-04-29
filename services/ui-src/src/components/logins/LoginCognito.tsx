import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
// components
import { Button, Heading, Input, Stack } from "@chakra-ui/react";

const useFormFields = (initialState: any) => {
  const [fields, setValues] = useState(initialState);
  return [
    fields,
    function (event: Event) {
      setValues({
        ...fields,
        [(event.target as HTMLTextAreaElement).id]: (
          event.target as HTMLTextAreaElement
        ).value,
      });
    },
  ];
};

export const LoginCognito = () => {
  const navigate = useNavigate();
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      await Auth.signIn(fields.email, fields.password);
      navigate(`/`);
    } catch (error) {
      console.log("Error while logging in.", error); // eslint-disable-line no-console
    }
  };

  return (
    <Stack>
      <Heading mb="2" size="md" alignSelf="center">
        Login with Cognito
      </Heading>
      <label>
        <Heading mb="2" size="sm">
          Email
        </Heading>
        <Input
          id="email"
          name="email"
          type="email"
          value={fields.email}
          onChange={handleFieldChange}
          className="field"
        />
      </label>
      <label>
        <Heading mb="2" size="sm">
          Password
        </Heading>
        <Input
          id="password"
          name="password"
          type="password"
          value={fields.password}
          onChange={handleFieldChange}
          className="field"
        />
      </label>
      <Button
        colorScheme="colorSchemes.main"
        onClick={() => {
          handleLogin();
        }}
        isFullWidth
        data-testid="cognito-login-button"
      >
        Login with Cognito
      </Button>
    </Stack>
  );
};
