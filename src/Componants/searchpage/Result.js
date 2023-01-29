import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function Result() {
  let params = useParams();
  let navigate = useNavigate();
  let { meal_id } = params;
  let [Restaurant, setRestaurant] = useState([]);
  let [LocationList, setLocationList] = useState([]);
  let [filter, setfilter] = useState({ meal_type: meal_id });

  let getLocationList = async () => {
    let Result = await axios.get("https://zomato-api-production.up.railway.app/api/get-Location");
    let data = Result.data;

    if (data.status === true) {
      setLocationList([...data.result]);
    } else {
      setLocationList([]);
    }
  };

  let filterOperation = async (filter) => {
    try {
      let url = `https://zomato-api-production.up.railway.app/api/filter`;
      let responce = await axios.post(url, filter);
      let { data } = responce;

      if (data.status === true) {
        setRestaurant([...data.newResult]);
      } else {
        setRestaurant([]);
      }
    } catch (error) {
      alert("Server side error", error);
      console.log(error);
    }
  };
  
  let getFiltration = (event, type) => {
    let value = event.target.value;
    let _filter = { ...filter };
    switch (type) {
      case "location":
        if (Number(value) > 0) {
          _filter["location"] = Number(value);
        } else {
          delete _filter["location"];
        }
        break;

      case "sort":
        _filter["sort"] = Number(value);
        break;

      case "CostForTwo":
        let cost = value.split("-");
        console.log(cost);
        _filter["lcost"] = Number(cost[0]);
        _filter["hcost"] = Number(cost[1]);
        break;

      case "page":
        _filter["page"] = Number(value);
        console.log(_filter);
        break;

      case "cuisine":
        _filter["cuisine"] = Number(value)
        console.log(_filter);
  
    }

    setfilter({ ..._filter });
    filterOperation(_filter);
  };
  useEffect(() => {
    filterOperation();
    getLocationList();
  }, []);
  return (
    <>
      <section className="d-flex justify-content-around align-items-center flex-column row ">
        <p className="color-blue my-3 fs-2 d-flex d-md-inline d-lg-inline justify-content-center col-12 col-md-10 col-lg-9 fw-bold">
          Breakfast Places in Delhi
        </p>

        <section className="d-flex justify-content-center align-items-center align-items-md-start  flex-column flex-md-row flex-lg-row container row ">
          <div className=" col-11 col-md-5 col-lg-2 box-shadow d-flex flex-column align-items-start py-3 mb-3 mb-md-3 card-hover">
            <div className="container ">
              <div className=" d-flex justify-content-between align-items-center">
                <p className="color-blue fs-5 margin-ten fw-bold">Filters</p>
                <button
                  className="btn d-lg-none fa fa-arrow-down color-blue"
                  data-bs-toggle="collapse"
                  data-bs-target="#filter-collaps"
                  aria-controls="filter-collaps"
                ></button>
              </div>
              <div id="filter-collaps">
                <div className="filter-location-area">
                  <div>
                    <p className="color-blue fs-6 m-0 fw-bold">
                      Select location
                    </p>
                  </div>
                  <select
                    name=""
                    id="select-location"
                    onChange={(event) => getFiltration(event, "location")}
                  >
                    <option >Select Location</option>
                    {LocationList.map((location, index) => {
                      return (
                        <option value={location.location_id} key={index}>
                          {location.name},{location.city}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex-column d-flex">
                  <p className="color-blue h6  margin-ten fw-normal">cuisine</p>
                  <label htmlFor="checkbox"></label>

                  <div className="cuisine-checkbox color-mute d-flex fw-normal align-items-center">
                    <input
                      type="checkbox"
                      name="Cuisine"
                      id="checkbox1"
                      value={1}
                      onClick={(event) => getFiltration(event, "cuisine")}
                    />
                    <label htmlFor="checkbox1">North-indian</label>
                  </div>

                  <div className="cuisine-checkbox color-mute d-flex fw-normal align-items-center">
                    <input
                      type="checkbox"
                      id="checkbox2"
                      name="Cuisine"
                      value={2}
                      onClick={(event) => getFiltration(event, "cuisine")}
                    />
                    <label htmlFor="checkbox2">South Indian</label>
                  </div>

                  <div className="cuisine-checkbox color-mute d-flex fw-normal align-items-center">
                    <input
                      type="checkbox"
                      id="checkbox3"
                      name="Cuisine"
                      value={3}
                      onClick={(event) => getFiltration(event, "cuisine")}
                    />
                    <label htmlFor="checkbox3">Chinese</label>
                  </div>

                  <div className="cuisine-checkbox color-mute d-flex fw-normal align-items-center">
                    <input
                      type="checkbox"
                      id="checkbox4"
                      name="Cuisine"
                      value={4}
                      onClick={(event) => getFiltration(event, "cuisine")}
                    />
                    <label htmlFor="checkbox4">Fast Food</label>
                  </div>

                  <div className="cuisine-checkbox color-mute d-flex fw-normal align-items-center">
                    <input
                      type="checkbox"
                      id="checkbox5"
                      name="Cuisine"
                      value={5}
                      onClick={(event) => getFiltration(event, "cuisine") }
                    />
                    <label htmlFor="checkbox5">Street Food</label>
                  </div>
                </div>
                <div className="cost-box">
                  <p className="fs-small color-blue margin-ten fw-normal">
                    Cost For Two
                  </p>
                  <div className="cost-area color-mute fw-normal d-flex align-items-center ">
                    <input
                      type="radio"
                      name="Cost For two"
                      id="cost1"
                      value="0 - 500"
                      onChange={(event) => getFiltration(event, "CostForTwo")}
                    />
                    <label htmlFor="cost1">Less than ` 500</label>
                  </div>

                  <div className="cost-area color-mute fw-normal d-flex align-items-center">
                    <input
                      type="radio"
                      name="Cost For two"
                      id="cost2"
                      value="500 - 1000"
                      onChange={(event) => getFiltration(event, "CostForTwo")}
                    />
                    <label htmlFor="cost2"> ` 500 to ` 1000</label>
                  </div>

                  <div className="cost-area color-mute fw-normal d-flex align-items-center">
                    <input
                      type="radio"
                      name="Cost For two"
                      id="cost3"
                      value="1000 - 1500"
                      onChange={(event) => getFiltration(event, "CostForTwo")}
                    />
                    <label htmlFor="cost3"> ` 1000 to ` 1500</label>
                  </div>

                  <div className="cost-area color-mute fw-normal d-flex align-items-center">
                    <input
                      type="radio"
                      name="Cost For two"
                      id="cost4"
                      value="1500 - 2000"
                      onChange={(event) => getFiltration(event, "CostForTwo")}
                    />
                    <label htmlFor="cost4"> ` 1500 to ` 2000</label>
                  </div>

                  <div className="cost-area color-mute fw-normal d-flex align-items-center">
                    <input
                      type="radio"
                      name="Cost For two"
                      id="cost5"
                      value="2000 - 99999"
                      onChange={(event) => getFiltration(event, "CostForTwo")}
                    />
                    <label htmlFor="cost5"> ` 2000+</label>
                  </div>
                </div>
                <div className="color-mute fw-normal ">
                  <p className="title-sort fs-6 color-blue mb-0 margin-ten fw-bold">
                    Sort
                    <i className="fa fa-solid fa-sort px-1"></i>
                  </p>
                  <div className=" d-flex align-items-center sort-area ">
                    <input
                      type="radio"
                      name="Sort"
                      id="sort"
                      value={1}
                      onChange={(event) => getFiltration(event, "sort")}
                    />
                    <label htmlFor="sort">Price low to high</label>
                  </div>

                  <div className=" d-flex align-items-center sort-area">
                    <input
                      type="radio"
                      name="Sort"
                      id="sort1"
                      value={-1}
                      onChange={(event) => getFiltration(event, "sort")}
                    />
                    <label htmlFor="sort1">Price high to low</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section className="d-flex flex-column align-items-center col-12 col-md-10 col-lg-7  row">
            {Restaurant.map((restaurant, index) => {
              return (
                <article
                  className="box-shadow px-0 px-md-2 px-lg-3 py-0 py-md-2 py-lg-3 col-12 col-md-9 col-lg-10 mb-3 pointer card-hover"
                  key={index}
                  onClick={() => navigate("/restaurant/" + restaurant._id)}
                >
                  <div className="food-box m-2 border-bottom border-3 ">
                    <div className="d-flex mb-3 align-items-center">
                      <img
                        src={"/imgs/" + restaurant.image}
                        alt=""
                        className="food-logo"
                      />
                      <div className="ms-3 d-flex flex-column justify-content-center">
                        <p className="fs-3 color-blue mb-1 fw-bold">
                          {restaurant.name}
                        </p>
                        <p className="color-blue fs-small ms-0 fw-bold">
                          {restaurant.city}
                        </p>
                        <p className="color-mute fs-small ms-0 fw-bold">
                          {restaurant.locality},{restaurant.city}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex">
                    <p className="d-flex flex-column color-mute p-1 mx-1 my-1 fw-bold fs-small">
                      CUISINES : <span className=" my-1 "> COST FOR TWO :</span>
                    </p>
                    <p className="d-flex flex-column color-blue p-1 mx-1 my-1 fw-bold fs-small">
                      {restaurant.cuisine.reduce((pValue, cValue) => {
                        return pValue.name + " , " + cValue.name;
                      })}
                      <span className="my-1 ">
                        <i className="fa fa-inr"></i> {restaurant.min_price}
                      </span>
                    </p>
                  </div>
                </article>
              );
            })}

            <div className="pagignation-area d-flex justify-content-around align-items-center mt-2">
            <button className="ms-2 btn btn-primary btn-sm w-50" onClick={() => window.location.reload()}> Reset Filter </button>
              <ul className="my-0 d-flex align-items-center">
                <li className="btn btn-outline-danger active">&lt;</li>
                <li
                  className=" btn btn-primary px-2"
                  value={1}
                  onClick={(event) => getFiltration(event, "page")}
                >
                  1
                </li>
                <li
                  className=" btn btn-primary "
                  value={2}
                  onClick={(event) => getFiltration(event, "page")}
                >
                  2
                </li>
                <li
                  className=" btn btn-primary "
                  value={3}
                  onClick={(event) => getFiltration(event, "page")}
                >
                  3
                </li>
                <li
                  className=" btn btn-primary "
                  value={4}
                  onClick={(event) => getFiltration(event, "page")}
                >
                  4
                </li>
                <li
                  className=" btn btn-primary "
                  value={5}
                  onClick={(event) => getFiltration(event, "page")}
                >
                  5
                </li>
                <li
                  className=" btn btn-outline-danger active"
                  value={5}
                  onClick={(event) => getFiltration(event, "page")}
                >
                  &gt;
                </li>
              </ul>
            </div>
          </section>
        </section>
      </section>
    </>
  );
}

export default Result;
