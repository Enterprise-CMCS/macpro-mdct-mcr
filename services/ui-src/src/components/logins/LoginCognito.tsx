import { useState } from "react";
import { useNavigate } from "react-router-dom";
// components
import { Box, Button, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { ErrorAlert } from "components";
// types
import { ErrorVerbiage } from "types";
// utils
import { loginUser } from "utils";
// verbiage
import { loginCredentialsError, loginError } from "verbiage/errors";

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
      await loginUser(fields.email, fields.password);
      navigate("/");
    } catch (error: any) {
      // the error name here comes from Cognito
      if (error.name === "NotAuthorizedException") {
        setError(loginCredentialsError);
      } else {
        setError(loginError);
      }
    }
  };

  return (
    <Stack>
      <Heading size="md" as="h2" sx={sx.heading}>
        Log In with Cognito
      </Heading>
      <ErrorAlert error={error} sxOverride={sx.error} />
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
