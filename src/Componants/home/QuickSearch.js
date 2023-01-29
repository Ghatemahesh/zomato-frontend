import axios from "axios";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"

function Quicksearch() {
  let [MealTypeList, setMealTypelist] = useState([]);
  let getMealtype = async () => {
    let Result = await axios.get("https://zomato-api-production.up.railway.app/api/get-mealType");
    let Data = Result.data; 
  
    if (Data.status === true) {
      setMealTypelist([...Data.mealDetails]);
    } else {
      setMealTypelist([]); 
    }
  };
  let navigate = useNavigate()
  let getSearchPage = (id)=>{
    navigate("/search-page/" + id)
  }
  useEffect(() => {
    getMealtype();
  }, []);
  return (
    <>
      <section className=" container-fluid">
        <main className="container">
          <div className="container-fluid row justify-content-start m-0 ">
          <p className="h3 fw-bolder mt-4 mb-2 color-blue media-width col-11 ms-0 ms-md-4">
            Quick Searches
          </p>
          <p className=" small fw-bold color-mute media-width col-11 ms-0 ms-md-4">
            Discover restaurants by type of meal
          </p>
          </div>

          <div className="container-fluid row justify-content-evenly align-items-center flex-wrap m-0 flex-row">
            {MealTypeList.map((mealType,index) => {
              return (
              <div key={index} className="col-3 d-flex ps-0 box-shadow mt-3 mx-2 box-height mb-3 card-hover pointer" onClick={ () => getSearchPage(mealType.meal_type)}>
                <img
                  src={"/imgs/" + mealType.image}
                  alt=""
                  className="food-item-image "
                />
                <div className="d-flex justify-content-center  ps-3 flex-column">
                  <p className=" fw-bolder color-blue mb-1 ">{mealType.name}</p>
                  <p className=" small color-mute m-0">{mealType.content}</p>
                </div>
              </div>)
            })}
          </div>
        </main>
      </section>
    </>
  );
}

export default Quicksearch;
