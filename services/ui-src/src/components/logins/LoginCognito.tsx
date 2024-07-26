import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
// components
import { Box, Button, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { ErrorAlert } from "components";
import { ErrorVerbiage } from "types";

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
  const [error, setError] = useState<ErrorVerbiage>();

  const handleLogin = async (event: any) => {
    event.preventDefault();
    try {
      await Auth.signIn(fields.email, fields.password);
      navigate(`/`);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Stack>
      <Heading size="md" as="h2" sx={sx.heading}>
        Log In with Cognito
      </Heading>
      <ErrorAlert error={error} sx={sx.error} />
      <form onSubmit={(event) => handleLogin(event)}>
        <Box sx={sx.label}>
          <label>
            <Text sx={sx.labelDescription}>Email</Text>
            <Input
              id="email"
              name="email"
              type="email"
              value={fields.email}
              onChange={handleFieldChange}
              className="field"
            />
          </label>
        </Box>
        <Box sx={sx.label}>
          <label>
            <Text sx={sx.labelDescription}>Password</Text>
            <Input
              id="password"
              name="password"
              type="password"
              value={fields.password}
              onChange={handleFieldChange}
              className="field"
            />
          </label>
        </Box>
        <Button
          sx={sx.button}
          onClick={handleLogin}
          isFullWidth
          type="submit"
          data-testid="cognito-login-button"
        >
          Log In with Cognito
        </Button>
      </form>
    </Stack>
  );
};

const sx = {
  heading: {
    alignSelf: "center",
  },
  error: {
    marginY: "1rem",
  },
  label: {
    marginBottom: "1rem",
  },
  labelDescription: {
    marginBottom: "0.5rem",
  },
  button: {
    marginTop: "1rem",
    width: "100%",
  },
};
