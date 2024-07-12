import React from "react";

import HomeCardList from "@/components/HomeCardList";


const Home = () => {

  const now = new Date()
  const time = now.toLocaleTimeString('en-in', {hour:'2-digit' , minute:'2-digit'})
  const date = (new Intl.DateTimeFormat('en-in', {dateStyle:'full'})).format(now)

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[290px] rounded py-2 text-center text-base font-normal">
            Upcommming Metting at: 12:30 PM
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl uppercase" >{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl" >{date}</p>
          </div>
        </div>
      </div>

      <HomeCardList />
    </section>
  );
};

export default Home;
