import React from "react";
import "./App.css";
import Home from "./components/Home";
import { QueryClient, QueryClientProvider } from "react-query";
import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";

const queryClient = new QueryClient();

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Home />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
