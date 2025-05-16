import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./styles/index.css"
import { ThemeProvider } from "./context/ThemeContext"
import { UserProvider } from "./context/UserContext"
import { MeasurementProvider } from "./context/MeasurementContext"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <UserProvider>
        <MeasurementProvider>
          <App />
        </MeasurementProvider>
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
