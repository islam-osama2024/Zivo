import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import image1 from "../../assets/image/fresh.avif";
import image2 from "../../assets/image/phone.avif";
import image3 from "../../assets/image/product-single-img-1.jpg";

const slides = [
    {
        img: image1,
        title: "Summer Sale",
        subtitle: "Up to 50% Off on selected items",
        badge: "LIMITED OFFER",
        cta: "Shop Now",
        align: "left",
    },
    {
        img: image2,
        title: "New Arrivals",
        subtitle: "Check out our latest tech collection",
        badge: "JUST IN",
        cta: "Explore",
        align: "center",
    },
    {
        img: image3,
        title: "Best Deals",
        subtitle: "Limited time offers you can't miss",
        badge: "HOT 🔥",
        cta: "View Deals",
        align: "right",
    },
];

function PrevArrow({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
            ‹
        </button>
    );
}

function NextArrow({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
            ›
        </button>
    );
}

export default function SimpleSlider() {
    const [current, setCurrent] = useState(0);

    const settings = {
        dots: false,
        infinite: true,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        fade: true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        beforeChange: (_, next) => setCurrent(next),
    };

    const alignClass = {
        left: "items-start text-left pl-10 md:pl-16",
        center: "items-center text-center",
        right: "items-end text-right pr-10 md:pr-16",
    };

    return (
        <div className="relative w-full h-full overflow-hidden">
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index} className="relative w-full h-[36rem] outline-none">
                        {/* صورة الخلفية */}
                        <img
                            src={slide.img}
                            alt={slide.title}
                            className="w-full h-[36rem] object-cover"
                        />

                        {/* Overlay متدرج */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                        {/* النص */}
                        <div className={`absolute inset-0 flex flex-col justify-center gap-4 px-6 ${alignClass[slide.align]}`}>
                            {/* Badge */}
                            <span className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-widest w-fit">
                                {slide.badge}
                            </span>

                            {/* Title */}
                            <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
                                {slide.title}
                            </h2>

                            {/* Subtitle */}
                            <p className="text-base md:text-xl text-white/80 max-w-sm drop-shadow">
                                {slide.subtitle}
                            </p>

                            {/* CTA Button */}
                            <button className="mt-2 px-7 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-full w-fit transition-all duration-200 hover:scale-105 shadow-lg text-sm">
                                {slide.cta} →
                            </button>
                        </div>
                    </div>
                ))}
            </Slider>

            {/* Dots مخصصة */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, i) => (
                    <div
                        key={i}
                        className={`transition-all duration-300 rounded-full ${i === current
                                ? "w-6 h-2 bg-green-400"
                                : "w-2 h-2 bg-white/50 hover:bg-white/80"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}