import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default function SimpleSlider() {
    const slides = [
        {
            img: "image1.jpg",
            title: "Slide 1",
            subtitle: "Subtitle 1"
        },
        {
            img: "image2.jpg",
            title: "Slide 2",
            subtitle: "Subtitle 2"
        },
        {
            img: "image3.jpg",
            title: "Slide 3",
            subtitle: "Subtitle 3"
        }
    ];

    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        fade: true,

    };

    return (
        <div className="relative w-full h-full">
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index} className="relative w-full h-full">
                        <img
                            src={slide.img}
                            alt={slide.title}
                            className="w-full h-full object-cover block"
                        />

                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-6">
                            <h2 className="text-4xl md:text-5xl font-bold mb-3">
                                {slide.title}
                            </h2>
                            <p className="text-lg md:text-xl">
                                {slide.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
