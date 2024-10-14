import React, { useState } from "react";
import Register1 from "./pages/Register1";
import Register2 from "./pages/Register2";

const RegisterScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  switch (currentPage) {
    case 1:
      return <Register1 nextPage={() => setCurrentPage(2)} />;
    case 2:
      return <Register2 nextPage={() => setCurrentPage(3)} />;
  }
};

export default RegisterScreen;
