import React, { Suspense } from "react";
import Login from "./authLogin";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <Suspense><Login /></Suspense>
    </div>
  );
};

export default page;
