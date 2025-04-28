// HomePage.js
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { register } from 'swiper/element/bundle';

import 'swiper/css';
import 'swiper/css/pagination';

import SlideContent from '../components/SlideContent';

// Swiper 모듈 등록
register();

const HomePage = () => {
  const [swiper, setSwiper] = useState(null);

  const handleScrollDown = () => {
    if (swiper) {
      swiper.slideNext();
    }
  };

  return (
      <div className="homepage">

        <Swiper
            modules={[Pagination]}
            direction="vertical"
            mousewheel={true}
            pagination={{ clickable: true }}
            className="mySwiper"
            onSwiper={setSwiper}
        >
          <SwiperSlide><SlideContent slideNum={1} /></SwiperSlide>
          <SwiperSlide><SlideContent slideNum={2} /></SwiperSlide>
          <SwiperSlide><SlideContent slideNum={3} /></SwiperSlide>
        </Swiper>

        <div className="scroll_down" onClick={handleScrollDown}>
          <img
              src="/images/scroll_arrow.png"
              srcSet="/images/scroll_arrow@2x.png 2x, /images/scroll_arrow@3x.png 3x"
              alt="아래로 스크롤"
          />
        </div>
      </div>
  );
};

export default HomePage;