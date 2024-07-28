import React, { useEffect, useState } from "react";

const About = () => {
  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      <div className="relative">
        <h1
          className="flex gap-4 items-center text-[2rem] sm:text-[2.75rem] 
          md:text-[3rem] lg:text-[3.8rem] leading-[56px] md:leading-[67px] 
          lg:leading-[90px] tracking-[15px] mx-auto w-fit font-extrabold about-h1"
          style={{
            background: "hsl(222.2 84% 4.9%)",
          }}
        >
          ABOUT <span className="text-tubeLight-effect font-extrabold">ME</span>
        </h1>
        <span className="absolute w-full h-1 top-7 sm:top-7 md:top-8 lg:top-11 z-[-1] bg-slate-200"></span>
      </div>
      <div className="text-center">
        <p className="uppercase text-xl text-slate-400">
          Allow me to introduce myself.
        </p>
      </div>
      <div>
        <div className="grid md:grid-cols-2 my-8 sm:my-20 gap-14">
          <div className="flex justify-center items-center">
            <img
              src="./Me.jpg"
              alt="avatar"
              className="bg-white p-2 sm:p-4 rotate-[25deg] h-[240px] sm:h-[340px] md:h-[350px] lg:h-[450px]"
            />
          </div>
          <div className="flex justify-center flex-col tracking-[1px] text-xl gap-5">
           <h2>
           Passionate Computer Science Engineering Student | MERN | PERN | Futuristic AI Engineer
           </h2>
            <p>
             As a dedicated 3rd-year CSE student, I am expanding my expertise in Full Stack Development . I have developed multiple web apps using the PERN stack, contributed to open-source projects. Actively solving DSA problems in Java.
            </p>
          </div>
        </div>
        <p className="tracking-[1px] text-xl">
        🥋 I'm a very Passionate For Programming and Problem-Solving Enthusiast. I'm always ready to learn new things with Effective ideas. Hardcore DSA Lover ❤
        </p>
      </div>
    </div>
  );
};

export default About;
