import { useEffect, useState } from "react";
import Header from "../Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Swal from 'sweetalert2'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

function Restaurantpage() {
  let [tab, setTab] = useState(1);
  let [items, setItems] = useState([]);
  let { id } = useParams();
  let defaultvalue = {
    aggregate_rating: 0,
    city: "",
    city_id: -1,
    contact_number: 0,
    cuisine: [],
    cuisine_id: [],
    image: "",
    locality: "",
    location_id: -1,
    mealtype_id: -1,
    min_price: 0,
    name: "",
    rating_text: "",
    thumb: [],
    _id: -1,
  };
  let getTokenDetails = () => {
    let token = localStorage.getItem("auth-token");
    if (token === null) {
      return false;
    } else {
      return jwtDecode(token);
    }
  };
  let [userDetails, setUserDetails] = useState(getTokenDetails());
  
  let [restaurant, setRestaurant] = useState({ ...defaultvalue });
  let [total_price, setTotal_price] = useState(0);

  let getRestaurant = async () => {
    try {
      let url = "https://zomato-api-production.up.railway.app/api/get-Restaurant-by-id/" + id;
      let { data } = await axios.get(url);
      if (data.status === true) {
        setRestaurant({ ...data.result });
      } else {
        setRestaurant({ ...defaultvalue });
      }
    } catch (error) {
      console.log(error);
      alert("server error");
    }
  };
  
  let getMenuItems = async () => {
    try {
      let url =
        "https://zomato-api-production.up.railway.app/api/get-menu-items-by-restaurant-id/" + id;
      let { data } = await axios.get(url);
      console.log(data);
      if (data.status === true) {
        setItems([...data.result]);
        console.log([...data.result]);
      } else {
        setItems([]);
      }
      setTotal_price(0)
    } catch (error) {
      console.log(error);
    }
  };

  let addItem = (index) => {
    let _price = Number(items[index].price);
    let menu_items = [...items];
    menu_items[index].qty += 1;
    setTotal_price(total_price + _price);
    setItems(menu_items);
  };

  let removeItem = (index) => {
    let _price = Number(items[index].price);
    let menu_items = [...items];
    menu_items[index].qty -= 1;
    setTotal_price(total_price - _price);
    setItems(menu_items);
  };

  function loadScript() {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      return true;
    };
    script.onerror = () => {
      return false;
    };
    window.document.body.appendChild(script);
  }

  let Display_Razorpay = async () => {
    let isLoaded = await loadScript();
    if (isLoaded === false) {
      alert("SDK is not loaded");
      return false;
    }
    let serverData = {
      amount : total_price
    }
    let url = "https://zomato-api-production.up.railway.app/api/payment/gen-order";
    let { data } = await axios.post(url , serverData);

    let order = data.order;

    var options = {
      key: "rzp_test_gxPyLR1dtP1T5d", // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: order.currency,
      name: "Zomato Clone",
      description: "Buying A Product From Zomato",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRl-fX4H37jdR6MC5JAkC4dapCz9tmyXQWLebZtYiB490VKE39M1p5Yni-xC9CtX2yEac&usqp=CAU",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        let Send_data = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        };
        let url = "https://zomato-api-production.up.railway.app/api/payment/verify";
        let { data } = await axios.post(url, Send_data);
        if (data.status === true) {
          Swal.fire({
            icon: 'success',
            title: 'Payment Successfull 😊',
            text: 'Enjoy !',
          }).then(()=>{
            window.location.replace("/");
          })
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Payment Failed ',
            text: 'Please try again !',
          }).then(()=>{
            window.location.replace("/");
          })
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: "9999999999",
      },
    };
    var Razorpay_Obj = window.Razorpay(options);
    Razorpay_Obj.open();
  };

  useEffect(() => {
    getRestaurant();
  },[]);
  return (
    <>
    <div
        className="modal fade"
        id="slideShow"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg " style={{ height: "75vh" }}>
          <div className="modal-content">
            <div className="modal-body h-75">
              <Carousel showThumbs={false} infiniteLoop={true}>
                {restaurant.thumb.map((value, index) => {
                  return (
                    <div key={index} className="w-100">
                      <img src={"/imgs/" + value} />
                    </div>
                  );
                })}
              </Carousel>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title color-blue fw-bold fs-4"
                id="exampleModalToggleLabel"
              >
                {restaurant.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {items.map((item, index) => {
                return (
                  <div
                    className="row py-3 border-bottom border-2 card-hover"
                    key={index}
                  >
                    <div className="col-8 d-flex flex-column justify-content-center">
                      <p className="h6 p-0 fw-bold color-blue">{item.name}</p>
                      <p className="small mb-1 fw-bold color-blue">
                        ₹ {item.price}
                      </p>
                      <p className="small color-mute mb-0">
                        {item.description}
                      </p>
                    </div>
                    <div className="col-4 d-flex justify-content-end">
                      <div className="menu-food-item">
                        <img src={"/imgs/" + item.image} alt="" />
                        {item.qty === 0 ? (
                          <button
                            className="btn btn-sm btn-primary text-light add "
                            onClick={() => addItem(index)}
                          >
                            add
                          </button>
                        ) : (
                          <div className="order-item-count section ">
                            <span
                              className="pointer"
                              onClick={() => removeItem(index)}
                            >
                              -
                            </span>
                            <span className="text-light">{item.qty}</span>
                            <span
                              className="pointer"
                              onClick={() => addItem(index)}
                            >
                              +
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {total_price > 0 ? (
              <div className="modal-footer d-flex justify-content-between px-2">
                <p className="fs-4 color-blue fw-bold">
                  Subtotal ` {total_price}
                </p>
                <button
                  className="btn btn-danger"
                  data-bs-target="#exampleModalToggle2"
                  data-bs-toggle="modal"
                >
                  <i className="fa fa-duotone fa-credit-card me-2"></i>
                  Pay Now
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title color-blue fw-bold fs-4"
                id="exampleModalToggleLabel2"
              >
                {restaurant.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label color-blue"
                >
                  User Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="enter your name"
                  value={userDetails.name}
                  readOnly={true}
                  onChange={() => {}}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput2"
                  className="form-label color-blue"
                >
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleFormControlInput2"
                  placeholder="name@example.com"
                  value={userDetails.email}
                  readOnly={true}
                  onChange={() => {}}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label color-blue"
                >
                  Address
                </label>
                <textarea
                  className="form-control "
                  id="exampleFormControlTextarea1"
                  rows="3"
                  value="amravati"
                  onChange={() => {}}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
              >
                Go Back
              </button>
              <button className="btn btn-success" onClick={Display_Razorpay}>
                PROCEED
              </button>
            </div>
          </div>
        </div>
      </div>

      <Header color=" bg-color-red" logo="" />
      <section className="container-fluid row justify-content-center align-items-center m-0">
        <div className="container col-12 col-md-11 d-flex  justify-content-center restaurant-main-image position-relative my-4">
          <img src={"/imgs/" + restaurant.image} alt="" />
          <button className="btn-gallery position-absolute btn fw-bold text-dark"
          data-bs-toggle="modal"
          data-bs-target="#slideShow">
            Click to see Image Gallery
          </button>
        </div>
        <div className="col-12 col-md-11 col-lg-11">
          <p className="fs-2 color-blue  fw-bold">{restaurant.name}</p>
          <div className="d-flex justify-content-between mt-4">
            <ul className="list-unstyled d-flex gap-1 justify-content-between  m-0">
              <li
                className="px-sm-1  px-lg-4 border-bottom  border-3 border-danger color-blue fw-bold pointer rounded-3"
                onClick={() => setTab(1)}
              >
                Overview
              </li>
              <li
                className=" px-sm-1  px-lg-4 color-blue fw-bold pointer border-bottom border-3 border-danger rounded-3"
                onClick={() => setTab(0)}
              >
                Contact
              </li>
            </ul>
            { userDetails ? (
            <a
              className="btn btn-danger px-1 px-md-4"
              data-bs-toggle="modal"
              href="#exampleModalToggle"
              role="button"
              onClick={getMenuItems}
            >
              Order Online
            </a> ) : (
              <button className="btn btn-danger" disabled>Login first to place order</button>
            )
}
          </div>
          {tab === 1 ? (
            <div>
              <p className="fs-4 color-blue my-4 fw-bold">About this place</p>
              <p className="fs-6 color-blue mb-1 fw-bold">Cuisine</p>
              <p className="small color-mute ">
                {restaurant.cuisine.length > 0
                  ? restaurant.cuisine.reduce((pValue, cValue) => {
                      return pValue.name + " , " + cValue.name;
                    })
                  : null}
              </p>

              <p className="fs-6 color-blue mb-1 fw-bold">Average Cost</p>
              <p className="small color-mute ">
                ₹{restaurant.min_price} for two people (approx.)
              </p>
            </div>
          ) : (
            <div className="ps-3 transition">
              <p className="color-blue mt-3 mb-1 mt- fs-6 fw-light">
                Phone Number
              </p>
              <p className="small color-red">+{restaurant.contact_number}</p>

              <p className="fs-6 color-blue mb-1 fw-bold">{restaurant.name}</p>
              <p className="small color-mute w-25 ">
                {restaurant.locality}, {restaurant.city}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
export default Restaurantpage;
