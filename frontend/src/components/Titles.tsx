import React from "react";

type TitleProps = {
  text: string;
};

const Title: React.FC<TitleProps> = ({ text }) => {
  return (
    <div className="flex items-center gap-4 p-10">
        <div>
    <h1 className="text-3xl font-light text-[#575757] mb-4">
      {text}
    </h1>
    </div>
    <div className="h-1.5 w-25 rounded-2xl bg-gradient-to-r from-[#9d80d4] to-[#BDBDBD] mb-2.5"></div>
    </div>
  );
};

export default Title;
