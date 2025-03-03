import React, { useState, useEffect } from "react";

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically move to the next image every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 2000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  const handleImageClick = (link) => {
    window.location.href = link;
  };

  return (
    <div className="relative w-full" style={{ maxWidth: "60rem", margin: "60px" }}>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <div
          className="flex transition-transform duration-500 " 
          style={{ transform: `translateX(-${currentIndex * 100}%)`, height:`350px` }}
        >
          {images.map((image, index) => (
             <div
              key={index}
              className="relative w-full flex-shrink-0 cursor-pointe " 
              onClick={() => handleImageClick(image.link)}
            >
              <img
                src={image}
                alt={`Slide ${index}`}
                className="w-full " style={{ height: `25rem` }}
              />
            </div>
          ))}
        </div>
      </div>
      <button
        className="absolute top-1/2 left-0 transform -translate-y-1/2  bg-opacity-50 text-white p-2 rounded-full "
        onClick={handlePrev}
      >
        &#9664;
      </button>
      <button
        className="absolute top-1/2 right-0 transform -translate-y-1/2  bg-opacity-50 text-white p-2 rounded-full"
        onClick={handleNext}
      >
        &#9654;
      </button>
    </div>
  );
};

export default Carousel;
