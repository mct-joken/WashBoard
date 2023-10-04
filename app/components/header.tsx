import React from "react";
import logo from "public/washboard-logo-circle.png";
interface HeaderProps {
  title: string;
}

export const Header: React.FunctionComponent<HeaderProps> = ({ title }) => {
  return (
    <div className="flex justify-center items-center h-16 mt-8 mb-4">
      <img
        src={logo}
        alt="icon"
        className="w-12 h-12 mr-1 ml-7 absolute left-0"
      />
      <h1 className="text-center absolute left-0 right-0 text-3xl">{title}</h1>
    </div>
  );
};
