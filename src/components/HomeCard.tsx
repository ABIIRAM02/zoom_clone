import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface HomeCardListProps {
  bgColor : string,
  description : string,
  title : string,
  imgUrl : string,
  handleClick : () => void
}

const HomeCard = ({imgUrl , title , description , bgColor , handleClick} : HomeCardListProps) => {

  return (
    <div onClick={handleClick} >
      <div  className={cn('meeting',bgColor)} >
        <div className="upcoming">
          <Image
            src={imgUrl}
            alt="metting"
            width={27}
            height={27}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h1 style={{ fontSize: "1.5rem" }} className="text-2xl font-bold">
            {title}
          </h1>
          <p className="text-lg font-normal">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;
