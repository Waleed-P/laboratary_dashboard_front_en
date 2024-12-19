import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import Spinner from "react-bootstrap/Spinner";
import "../../assets/css/auth.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { loginAPI, registerAPI } from "../../services/allAPI";
function Auth({ insideRegister }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const initialValues = {
    email: "",
    password: "",
    username: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    if (insideRegister) {
      formData.append("username", values.username);
    }
    const apiCall = insideRegister ? registerAPI : loginAPI;
    try {
      const result = await apiCall(formData);
      if (result.status == 200) {
        toast.success(
          insideRegister ? "Registration Successful" : "Login Successful"
        );
        resetForm();
        localStorage.setItem("token", result.data.token);
        setTimeout(() => {
          insideRegister ? navigate("/") : navigate("/list_doctors");
          setLoading(false);
        }, 1000);
      } else {
        toast.error(result.response.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="auth-container">
      <Row className="d-flex align-items-center justify-content-center vh-100">
        <Col md={6} lg={4}>
          <Card className="shadow-lg rounded p-4">
            <Card.Body>
              <h3 className="text-center mb-4 text-light fw-bold">
                {insideRegister ? "Register" : "  Login"}
              </h3>
              <Formik
                initialValues={initialValues} // Pass initial values here
                validationSchema={validationSchema} // Pass validation schema here
                onSubmit={handleSubmit} // Pass submit handler here
              >
                <FormikForm>
                  {insideRegister && (
                    <FormGroup controlId="formEmail" className="mb-2">
                      <FormLabel className="text-light">User Name</FormLabel>
                      <Field
                        name="username"
                        type="text"
                        className="form-control"
                        placeholder="Enter your user name"
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-danger"
                      />
                    </FormGroup>
                  )}

                  <FormGroup controlId="formEmail">
                    <FormLabel className="text-light">Email</FormLabel>
                    <Field
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </FormGroup>

                  <FormGroup controlId="formPassword">
                    <FormLabel className="text-light mt-2">Password</FormLabel>
                    <Field
                      name="password"
                      type="password"
                      className="form-control"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger"
                    />
                  </FormGroup>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-3 mb-3"
                    //   disabled={isSubmitting}
                  >
                    {loading ? (
                      <Spinner size="sm" />
                    ) : (
                      <>{insideRegister ? "Sign Up" : "Sign In"}</>
                    )}
                  </Button>
                </FormikForm>
              </Formik>
              {!insideRegister ? (
                <>
                  <p className="text-light">
                    New user click here to{" "}
                    <Link className="text-light" to={"/register"}>
                      Register
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-light">
                    Already have an account ? Please
                    <Link className="text-light ms-2" to={"/"}>
                      Login
                    </Link>{" "}
                  </p>
                </>
              )}
              {/* <hr /> */}
              {/* <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const decode = jwtDecode(credentialResponse?.credential);
                  console.log(decode);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              /> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Auth;
