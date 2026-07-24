import { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

const Page = styled.div`
  min-height: 100vh;
  background-color: #fffaf5;
`;

const Content = styled.main`
  padding: 64px 20px;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 32px;
  background-color: #ffffff;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(75, 46, 36, 0.12);
`;

const Title = styled.h1`
  margin: 0 0 12px;
  text-align: center;
  color: #4b2e24;
`;

const Subtitle = styled.p`
  margin: 0 0 28px;
  text-align: center;
  line-height: 1.6;
  color: #725448;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #4b2e24;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d8c8bd;
  border-radius: 8px;
  background-color: #fffdfb;

  &:focus {
    outline: 2px solid #a85d43;
    outline-offset: 1px;
  }
`;

const SubmitButton = styled.button`
  padding: 13px 18px;
  border: none;
  border-radius: 8px;
  background-color: #7a3e2d;
  color: white;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: #5f2f22;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

const Message = styled.p`
  margin: 0;
  text-align: center;
  color: ${({ $success }) => ($success ? "#2f7d32" : "#b42318")};
`;

const RegisterText = styled.p`
  margin: 24px 0 0;
  text-align: center;
  color: #725448;
`;

const RegisterLink = styled(Link)`
  color: #7a3e2d;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setMessage("");
      setSuccess(false);

      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        formData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setSuccess(true);
      setMessage(response.data.message);
    } catch (requestError) {
      console.error("LOGIN ERROR:", requestError);

      setSuccess(false);
      setMessage(
        requestError.response?.data?.message || "Failed to login."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Page>
      <Navbar />

      <Content>
        <FormCard>
          <Title>Log In</Title>

          <Subtitle>
            Log in to unlock the secret recipes in Secret Kitchen.
          </Subtitle>

          <Form onSubmit={handleSubmit}>
            <FieldGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </FieldGroup>

            {message && <Message $success={success}>{message}</Message>}

            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? "Logging in..." : "Log In"}
            </SubmitButton>
          </Form>

          <RegisterText>
            New to Secret Kitchen?{" "}
            <RegisterLink to="/register">Create account</RegisterLink>
          </RegisterText>
        </FormCard>
      </Content>
    </Page>
  );
}

export default Login;