import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
// components
import { Button, Heading, Input, Stack, Text } from "@chakra-ui/react";

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
      <Heading size="md" alignSelf="center">
        Login with Cognito
      </Heading>
      <label>
        <Text mb="2">Email</Text>
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
        <Text mb="2">Password</Text>
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
