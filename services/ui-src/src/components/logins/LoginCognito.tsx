import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
// components
import { Button, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { ErrorAlert } from "components";

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
  const [error, setError] = useState<string>();

  const handleLogin = async () => {
    try {
      await Auth.signIn(fields.email, fields.password);
      navigate(`/`);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Stack>
      <Heading size="md" sx={sx.heading}>
        Log In with Cognito
      </Heading>
      <label>
        <Text sx={sx.label}>Email</Text>
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
        <Text sx={sx.label}>Password</Text>
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
        sx={sx.button}
        colorScheme="colorSchemes.main"
        onClick={handleLogin}
        isFullWidth
        data-testid="cognito-login-button"
      >
        Log In with Cognito
      </Button>
      <ErrorAlert error={error} />
    </Stack>
  );
};

const sx = {
  heading: {
    alignSelf: "center",
  },
  label: {
    marginBottom: "0.5rem",
  },
  button: {
    width: "100%",
  },
};
