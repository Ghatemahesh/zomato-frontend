import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider ,GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useState } from "react";
import Swal from "sweetalert2";

function Header(props) {
  let navigate = useNavigate();
  let getTokenDetails = () => {
    let token = localStorage.getItem("auth-token");
    if (token === null) {
      return false;
    } else {
      return jwt_decode(token);
    }
  };
  let [userLogin, setUserLogin] = useState(getTokenDetails());
  let onSuccess = (credentialResponce) => {
    let token = credentialResponce.credential;
    //  save to local storage
    localStorage.setItem("auth-token", token);

    Swal.fire({
      icon: "success",
      title: "Login Successfully 😊",
      text: "Enjoy !",
    }).then(() => {
      window.location.reload();
    });
  };
  let onfail = () => {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: "Please try again !",
    });
  };

  // logout
  let Logout = () => {
    Swal.fire({
      title: "Are you sure ? 🥺",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout me!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Logout Successfull 👍",
          "Come back later ...! 😇",
          "success"
        ).then(() => {
          localStorage.removeItem("auth-token");
          window.location.reload();
        });
      }
    });
  };
  
  return (
    <>
      <GoogleOAuthProvider clientId="1006525183965-pdmd6e4fann0ijet2cp9cjd86fgh0831.apps.googleusercontent.com">
        <div
          className="modal fade"
          id="google-signup"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog ">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Google sign-in
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <GoogleLogin onSuccess={onSuccess} onError={onfail} />
              </div>
            </div>
          </div>
        </div>
        <section
          className={
            "container-fluid  d-flex justify-content-center" +
            props.color
          }
        >
          <header className="d-flex justify-content-between my-2 col-10">
            <div
              className={
                "d-flex align-items-center justify-content-center brand-area bg-white pointer" +
                props.logo
              }
              onClick={() => navigate("/")}
            >
              <p className="color-red fw-bold fs-3 m-0 fw-bold">e!</p>
            </div>
            {userLogin ? (
              <div className=" d-flex justify-content-center align-items-center">
                <button
                  className="btn btn-sm btn-outline-light fw-light fs-6 p-2"
                  onClick={() => Logout()}
                >
                  Logout
                  <i className="fa ms-1">&#xf08b;</i>
                </button>

                <p className="fs-6 text-light m-0 mx-2 ms-3">
                  {userLogin.given_name}
                </p>
                <img
                  src={userLogin.picture}
                  alt="user image"
                  className=" logo"
                />
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-center ">
                <button
                  className="btn btn-sm me-1 text-white fw-light fs-6"
                  data-bs-toggle="modal"
                  data-bs-target="#google-signup"
                >
                  Login
                  <i className="fa ms-1"> &#xf090;</i>
                </button>
                <button className="btn btn-sm btn-outline-light fw-light fs-6 p-2">
                  Create Account
                </button>
              </div>
            )}
          </header>
        </section>
      </GoogleOAuthProvider>
    </>
  );
}

export default Header;
