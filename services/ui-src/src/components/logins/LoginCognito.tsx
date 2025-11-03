import { useState } from "react";
import { useNavigate } from "react-router";
// components
import { Button, Heading, Stack } from "@chakra-ui/react";
import { ErrorAlert } from "components";
import { TextField } from "@cmsgov/design-system";
// types
import { ErrorVerbiage } from "types";
// utils
import { loginUser } from "utils";
// verbiage
import { loginError } from "verbiage/errors";

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
    } catch {
      setError(loginError);
    }
  };

  return (
    <Stack>
      <Heading size="md" as="h2" sx={sx.heading}>
        Log In with Cognito
      </Heading>
      {error && <ErrorAlert error={error} sxOverride={sx.error} />}
      <form onSubmit={(event) => handleLogin(event)}>
        <TextField
          id="email"
          name="email"
          type="email"
          label="Email"
          value={fields.email}
          onChange={handleFieldChange}
        />
        <TextField
          id="password"
          name="password"
          type="password"
          label="Password"
          value={fields.password}
          onChange={handleFieldChange}
        />
        <Button
          sx={sx.button}
          onClick={handleLogin}
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
    marginY: "spacer2",
  },
  button: {
    marginTop: "spacer4",
    width: "100%",
  },
};
