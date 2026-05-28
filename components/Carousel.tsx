'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';

// Styles Swiper (importés une fois dans le layout)
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface CarouselItem {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  title?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoplay?: boolean;
  delay?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
}

export default function Carousel({
  items,
  autoplay = true,
  delay = 3000,
  showNavigation = true,
  showPagination = true,
}: CarouselProps) {
  return (
    <div className="relative w-full h-96 md:h-[500px]">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={autoplay ? { delay, disableOnInteraction: false } : false}
        pagination={showPagination ? { clickable: true } : false}
        navigation={showNavigation}
        loop
        className="w-full h-full"
      >
        {items.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-full">
              {item.type === 'image' ? (
                <Image
                  src={item.src}
                  alt={item.alt || 'Réalisation'}
                  fill
                  className="object-cover"
                />
              ) : (
                <video
                  src={item.src}
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                />
              )}
              {item.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}