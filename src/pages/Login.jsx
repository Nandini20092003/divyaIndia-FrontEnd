import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import "../styles/login.css";
import loginImg from "../assets/images/login.png";
import userIcon from "../assets/images/user.png";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setCredentials((previous) => ({
      ...previous,
      [event.target.id]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    dispatch({ type: "LOGIN_START" });
    setSubmitting(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = result.message || "Unable to sign in";
        dispatch({ type: "LOGIN_FAILURE", payload: message });
        alert(message);
        return;
      }

      dispatch({ type: "LOGIN_SUCCESS", payload: result.data });
      navigate("/");
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: "Unable to connect to the server" });
      alert("Unable to connect to the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={loginImg} alt="Login" />
              </div>
              <div className="login__form">
                <div className="user"><img src={userIcon} alt="User" /></div>
                <h2>Login</h2>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <input type="email" placeholder="Email" required id="email"
                      autoComplete="email" value={credentials.email} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <input type="password" placeholder="Password" required id="password"
                      autoComplete="current-password" value={credentials.password} onChange={handleChange} />
                  </FormGroup>
                  <Button className="btn secondary__btn auth__btn" type="submit" disabled={submitting}>
                    {submitting ? "Signing in..." : "Login"}
                  </Button>
                </Form>
                <p>Don't have an account? <Link to="/register">Create Account</Link></p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
