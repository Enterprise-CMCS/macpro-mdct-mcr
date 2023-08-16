import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

export const RouterWrappedComponent: React.FC = ({ children }) => (
  <Router>{children}</Router>
);
