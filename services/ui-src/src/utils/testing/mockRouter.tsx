import React from "react";
import { BrowserRouter as Router } from "react-router";

export const RouterWrappedComponent: React.FC<{ children: any }> = ({
  children,
}) => <Router>{children}</Router>;
