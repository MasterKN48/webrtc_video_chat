import React, { lazy, Suspense } from "react";
import "./app.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";
const Join = lazy(() => import("./Component/Join"));
const Chat = lazy(() => import("./Component/Chat"));
const Temp = lazy(() => import("./Component/Chat/Temp"));
const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Suspense
          fallback={
            <div
              align="center"
              className="spinner-border text-primary"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          }
        >
          <Route path="/" exact component={Join} />
          <Route path="/chat" component={Chat} />
          <Route path="/temp" component={Temp} />
        </Suspense>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
