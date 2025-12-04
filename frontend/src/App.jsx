import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RouteConfig from "./Routes/RouteConfig.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouteConfig />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
