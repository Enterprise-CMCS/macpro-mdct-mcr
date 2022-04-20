import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
// utils
import { useFormFields } from "../../libs/hooksLib";
// components
import {
  Box,
  Button,
  Container,
  Divider,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";

interface Props {
  loginWithIDM: () => void;
}

const LocalLogin = () => {
  const navigate = useNavigate();
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });
  async function handleLogin() {
    try {
      await Auth.signIn(fields.email, fields.password);
      navigate(`/`);
    } catch (error) {
      console.log("Error while logging in.", error); // eslint-disable-line no-console
    }
  }
  return (
    <Stack>
      <Divider />
      <Heading mb="2" size="md" alignSelf="center">
        Login with Cognito
      </Heading>
      <Heading mb="2" size="sm">
        Email
      </Heading>
      <Input
        className="field"
        type="email"
        id="email"
        name="email"
        value={fields.email}
        onChange={handleFieldChange}
      />
      <Heading mb="2" size="sm">
        Password
      </Heading>
      <Input
        className="field"
        type="password"
        id="password"
        name="password"
        value={fields.password}
        onChange={handleFieldChange}
      />
      <Button
        colorScheme="teal"
        onClick={() => {
          handleLogin();
        }}
        isFullWidth
        data-cy="login-with-cognito-button"
      >
        Login with Cognito
      </Button>
    </Stack>
  );
};

export const LocalLogins = ({ loginWithIDM }: Props) => {
  return (
    <Container maxW="sm" h="full" my="auto">
      <Box textAlign="center" mb="6">
        <Heading mb="2" size="md" alignSelf="center">
          Developer Login{" "}
        </Heading>
        <Divider />
      </Box>
      <Stack spacing={8}>
        <Button colorScheme="teal" onClick={loginWithIDM} isFullWidth>
          Login with IDM
        </Button>
        <LocalLogin />
      </Stack>
    </Container>
  );
};
