import React from "react";

export const Content = ({ children }) => {
  return (
    <main className="container">
      <div className="row">
        <div className="col-lg-6 col-sm-7 my-lg-5 my-3 mx-auto">
          <div className="card border-0 shadow p-3">{children}</div>
        </div>
      </div>
    </main>
  );
};
