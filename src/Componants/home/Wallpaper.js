import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Header from "../Header";
import { useNavigate } from "react-router-dom";

function Wallpaper() {
  let navigate = useNavigate()
  let [LocationList, setLocationList] = useState([]);
  let [disabled, SetDisabled] = useState(true);
  let [RestaurantTab , setRestaurantTab] = useState([])

  let getLocationList = async () => {
    let Result = await axios.get("https://zomato-api-production.up.railway.app/api/get-Location");
    let data = Result.data;
    
    if (data.status === true) {
      setLocationList([...data.result]);
    } else {
      setLocationList([]);
    }
  };
  let getLocationId = async (event) => {
    let value = event.target.value;
    if (value !== "Select Location") {
      try {
        let Url = `https://zomato-api-production.up.railway.app/api/get-Restaurant-by-location-id/${value}`;

        let { data } = await axios.get(Url);
        if (data.status === true) {
          if (data.Result.length !== 0) {
            SetDisabled(false);
            setRestaurantTab([...data.Result])
          } else {
            setRestaurantTab([])
            SetDisabled(true);
          }
        }
       
      } catch (error) {
        alert("server side error");
      }
    } else {
      SetDisabled(true);
    }
  };

  useEffect(() => {
    getLocationList();
  }, []);

  return (
    <>
      <section className=" container-fluid  section-1 h-auto d-flex flex-column align-items-center justify-content-center section-gap">
        <Header color="" logo=" logo-hide"/>
        <div className="container ">
          <div className=" row d-flex justify-content-center ">
            <div className="brand-logo d-flex justify-content-center ">
              <p className=" m-0 display-2  d-flex align-items-center fw-bold text-danger text-center brand-text">
                e!
              </p>
            </div>
          </div>
        </div>

        <p className="main-title display-6  fw-bolder text-center text-light mb-0">
          Find the best restaurants, cafés, and bars
        </p>

        <main className="align-items-center flex-column container-fluid row flex-lg-row justify-content-center mb-5">
          <div className="col-sm-12 col-md-7 col-lg-2 bg-transparent card border-0">
            <select
              className="text-muted small px-2 py-3 "
              onChange={getLocationId}
            >
              <option>Select Location</option>
              {LocationList.map((location, index) => {
                return (
                  <option  value={location.location_id} key={index}>
                    {location.name},{location.city}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="col-sm-12 col-md-7 col-lg-5 my-2 ">
            <div className="location ">
              <div className="input-group border-0">
                <span className=" input-group-text bg-white ">
                  <i className="fa fa-search px-2"></i>
                </span>
                <input
                  type="text"
                  className="form-control ps-0 py-3 border-start-0 input-hover"
                  placeholder="Search for restaurants"
                  disabled={disabled}
                />
              </div>
              {
              disabled ? null : (
                
              <ul className="search-autocompleate small mt-1 p-2 pb-0 d-md-flex flex-column">
                { RestaurantTab.map((restaurant,index)=>{
                  return (
                <li key={index} className=" d-flex mb-1 border-bottom pt-1 pb-2 pointer" onClick={() => navigate("/restaurant/" + restaurant._id)}>
                  <img src={"/imgs/" + restaurant.image} alt="" />
                  <div className=" d-flex justify-content-center align-content-center flex-column ps-2">
                    <p className=" m-0 h6 fw-bold py-1 pt-0">
                      {restaurant.name}
                    </p>
                    <span className="small text-muted">
                      {restaurant.locality},{restaurant.city}
                    </span>
                  </div>
                </li>)

                })
}
              </ul>
                
              )

}
            </div>
          </div>
        </main>
      </section>
    </>
  );
}

export default Wallpaper;
