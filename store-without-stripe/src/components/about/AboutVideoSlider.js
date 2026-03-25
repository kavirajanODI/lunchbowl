import React from 'react';
import { useRef, useState } from "react";
import Slider from "react-slick";
//import ReactPlayer from "react-player/youtube";
const AboutVideoSlider = () => {

  const playerRefs = useRef([]);
  const [playingIndex, setPlayingIndex] = useState(null);

  const videoList = [
    { id: "video1", url: "/video/lunchbowl2.mp4" },
  ];
  const settings = {
    dots: true,
    arrows: true,
    infinite: false,
    beforeChange: () => {
      setPlayingIndex(null); // stop playing on slide change
    },
  };

  const handlePlay = (index) => {
    setPlayingIndex(index);
  };

  return (
    <div className="w-full mx-auto">
      <Slider {...settings} className='abtvidosliders'>
        {videoList.map((video, index) => (
          <div key={video.id} className="aspect-video relative Videobox">
            {playingIndex === index ? (
              <video
                ref={(el) => (playerRefs.current[index] = el)}
                src={video.url}
                width="100%"
                height="100%"
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full bg-black relative cursor-pointer"
                onClick={() => handlePlay(index)}
              >
                {/* Thumbnail */}
                <img
                  key={video.id}
                  src='/lunchbowl-poster.jpg'
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="avidoplaybtns absolute inset-0 flex items-center justify-center">
                  <button className="bg-white p-4 rounded-full shadow-lg text-black font-bold text-xl">
                    ▶
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
                
      </Slider>
    </div>
  )
}

export default AboutVideoSlider