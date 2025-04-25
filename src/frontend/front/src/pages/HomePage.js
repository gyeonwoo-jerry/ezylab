import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import Header from '../components/Header';
import SlideContent from '../components/SlideContent';

const HomePage = () => {
  const [swiper, setSwiper] = useState(null);

  const handleScrollDown = () => {
    if (swiper) {
      swiper.slideNext();
    }
  };

  return (
      <div className="homepage">
        <Header />

        {/* Swiper */}
        <Swiper
            direction="vertical"
            mousewheel={true}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination, Mousewheel]}
            className="mySwiper"
            onSwiper={setSwiper}
        >
          <SwiperSlide><SlideContent slideNum={1} /></SwiperSlide>
          <SwiperSlide><SlideContent slideNum={2} /></SwiperSlide>
          <SwiperSlide><SlideContent slideNum={3} /></SwiperSlide>
          <SwiperSlide><SlideContent slideNum={4} /></SwiperSlide>
          <SwiperSlide><SlideContent slideNum={5} /></SwiperSlide>
          <SwiperSlide><SlideContent slideNum={6} /></SwiperSlide>
          <SwiperSlide><SlideContent slideNum={7} /></SwiperSlide>
          <SwiperSlide><SlideContent slideNum={8} /></SwiperSlide>
          <SwiperSlide><SlideContent slideNum={9} /></SwiperSlide>
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