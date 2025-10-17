import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

export const RouterWrappedComponent: React.FC<{ children: any }> = ({
  children,
}) => (
  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    {children}
  </Router>
);
