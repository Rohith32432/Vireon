import React, { FC } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/Context/userContext";

const Check: FC = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <h1>Please login</h1>;
};

export default Check;
