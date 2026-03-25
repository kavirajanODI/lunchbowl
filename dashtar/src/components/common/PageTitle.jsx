import React from "react";
import { Helmet } from "react-helmet";

const PageTitle = ({ title, description }) => {
  return (
    <Helmet>
      <title>
        {" "}
        {title
          ? `${title} | Small Bites, Huge Impact`
          : "Lunch Bowl : Small Bites, Huge Impact"}
      </title>
      <meta
        name="description"
        content={
          description
            ? ` ${description} `
            : "Lunch Bowl : Small Bites, Huge Impact"
        }
      />
    </Helmet>
  );
};

export default PageTitle;
