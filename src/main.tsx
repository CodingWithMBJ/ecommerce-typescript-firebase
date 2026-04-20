import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./contexts/UserContext";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./styles/App.css";
import ToastProvider from "./contexts/ToastProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <UserProvider>
        <ToastProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </ToastProvider>
      </UserProvider>
    </Provider>
  </React.StrictMode>,
);
