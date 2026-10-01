import { useSelector } from "react-redux";
import "./App.css";
import LandingPage from "./views/LandingPage";
import { RootState } from "../src/store/store";

function App() {
  const authStatus = useSelector((state: RootState) => state.auth.status);
  console.log(authStatus);

  return (
    <div>
      <main>
        <LandingPage />
      </main>
    </div>
  );
}

export default App;
