import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="pt-16 p-10">
      <h2 className="text-2xl font-bold">This is Login</h2>
      <Link to='/register' className="mt-10 text-blue-600 underline block" to="/register">
        Go to Register
      </Link>
    </div>
  );
};

export default Login;
