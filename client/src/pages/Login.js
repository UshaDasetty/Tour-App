import React, { useState, useEffect } from "react";

import {
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCardFooter,
  MDBValidation,
  MDBBtn,
  MDBIcon,
  MDBSpinner,
} from "mdb-react-ui-kit";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { GoogleLogin } from "react-google-login";
import { googleSignIn, login } from "../redux/features/authSlice";


// Initial state of the Login form
const initialState = {
  email: "",
  password: "",
};

const Login = () => {

  const [formValue, setFormValue] = useState(initialState);
  const { email, password } = formValue;
  const { loading, error } = useSelector((state) => ({ ...state.auth }));

  const dispatch = useDispatch();    // To dispatch actions in this file
  const navigate = useNavigate();    // Used for navigationss

  /********************************************************************************/ 
  // It will run only when we have error and shows that error using toast 

  useEffect(() => {
    error && toast.error(error);
  }, [error]);

/********************************************************************************/
  // Submit Form Details

  const handleSubmit = (e) => {
    e.preventDefault();

    // If email and password are correct
    if (email && password) {
      dispatch(login({ formValue, navigate, toast }));        // after login it dispatch login value, and navigate  to the Home page and shows notification like Logged in successfully.
    }
  };

/********************************************************************************/
  // Takes Input from User 

  const onInputChange = (e) => {
    let { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

/********************************************************************************/
  // 

  const devEnv = process.env.NODE_ENV !== "production";

  /********************************************************************************/
  // Google Login

  const googleSuccess = (resp) => {
    const email = resp?.profileObj?.email;
    const name = resp?.profileObj?.name;
    const token = resp?.tokenId;
    const googleId = resp?.googleId;
    const result = { email, name, token, googleId };
    dispatch(googleSignIn({ result, navigate, toast }));
    console.log(resp);
  };

/********************************************************************************/
  // Google Login Fails

  const googleFailure = (error) => {
    toast.error(error);
  };

/********************************************************************************/

  return (
    <div
      style={{
        margin: "auto",
        padding: "15px",
        maxWidth: "450px",
        alignContent: "center",
        marginTop: "120px",
      }}
    >
      <MDBCard alignment="center">

          <MDBIcon fas icon="user-circle" className="fa-2x" />
          <h5>Sign In</h5>

          <MDBCardBody>
              <MDBValidation onSubmit={handleSubmit} noValidate className="row g-3">
                
                
                <div className="col-md-12">
                  <MDBInput
                    label="Email"
                    type="email"
                    value={email}
                    name="email"
                    onChange={onInputChange}
                    required
                    invalid
                    validation="Please provide your email"
                  />
                </div>


                <div className="col-md-12">
                  <MDBInput
                    label="Password"
                    type="password"
                    value={password}
                    name="password"
                    onChange={onInputChange}
                    required
                    invalid
                    validation="Please provide your password"
                  />
                </div>


                <div className="col-12">
                  <MDBBtn style={{ width: "100%" }} className="mt-2">
                    {/* when loading, it will spins on login button when login */}
                    {loading && (
                      <MDBSpinner
                        size="sm"
                        role="status"
                        tag="span"
                        className="me-2"
                      />
                    )}
                    Login
                  </MDBBtn>
                </div>
                
              </MDBValidation>


              <br />


              <GoogleLogin
                  clientId="524385671520-dqnqiev43cdssvdigv9ubj93hqa7sqca.apps.googleusercontent.com"
                  render={(renderProps) => (
                    <MDBBtn
                      style={{ width: "100%" }}
                      color="danger"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                        <MDBIcon className="me-2" fab icon="google" /> Google Sign In
                    </MDBBtn>
                  )}
                  onSuccess={googleSuccess}
                  onFailure={googleFailure}
                  cookiePolicy="single_host_origin"
              />

            
          </MDBCardBody>

          <MDBCardFooter>
            <Link to="/register">
              <p>Don't have an account ? Sign Up</p>
            </Link>
          </MDBCardFooter>

      </MDBCard>
    </div>
  );
};

export default Login;
