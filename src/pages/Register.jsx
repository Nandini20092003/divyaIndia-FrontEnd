import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import "../styles/login.css";
import registerImg from "../assets/images/register.png";
import userIcon from "../assets/images/user.png";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";

const Register = () => {
  const [credentials, setCredentials] = useState({ username: "", email: "", password: "" });
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
    setSubmitting(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        alert(result.message || "Unable to create account");
        return;
      }

      dispatch({ type: "REGISTER_SUCCESS" });
      alert("Account created successfully. Please sign in.");
      navigate("/login");
    } catch {
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
              <div className="login__img"><img src={registerImg} alt="Register" /></div>
              <div className="login__form">
                <div className="user"><img src={userIcon} alt="User" /></div>
                <h2>Register</h2>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <input type="text" placeholder="Username" required id="username"
                      minLength={3} maxLength={30} autoComplete="username"
                      value={credentials.username} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <input type="email" placeholder="Email" required id="email"
                      autoComplete="email" value={credentials.email} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <input type="password" placeholder="Password" required id="password"
                      minLength={8} maxLength={128} autoComplete="new-password"
                      value={credentials.password} onChange={handleChange} />
                  </FormGroup>
                  <Button className="btn secondary__btn auth__btn" type="submit" disabled={submitting}>
                    {submitting ? "Creating account..." : "Create Account"}
                  </Button>
                </Form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;
