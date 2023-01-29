import Homepage from "./Componants/home/Homepage";
import Searchpage from "./Componants/searchpage/SearchpageHome";
import {Routes,Route} from "react-router-dom"
import Restaurantpage from "./Componants/Restaurant/Restaurantpage";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Homepage />}/>
      <Route path="/search-page/:meal_id" element={<Searchpage/>}/>
      <Route path="/restaurant/:id" element={<Restaurantpage/>}/>
    </Routes>
    </>
  );
}

export default App;
