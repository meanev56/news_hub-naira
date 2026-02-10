// components/AdBanner.tsx
'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  wrap,
} from 'framer-motion';

interface AdSlide {
  id: number;
  imageUrl: string;
  alt: string;
  link?: string;
}

const adSlides: AdSlide[] = [
  {
    id: 1,
    imageUrl: '/ads/advertOne.webp',
    alt: 'Summer Sale - Up to 50% Off',
    link: '/shop/summer-sale',
  },
  {
    id: 2,
    imageUrl: '/ads/adidas.webp',
    alt: 'New Collection Just Dropped',
    link: '/collections/new-arrivals',
  },
  {
    id: 3,
    imageUrl: '/ads/Fidelity.svg',
    alt: 'Free Shipping on Orders Over $50',
    link: '/shipping-info',
  },
];

export default function AdBanner() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  const imageIndex = wrap(0, adSlides.length, page);
  const nextIndex = wrap(0, adSlides.length, page + 1);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-120, 120], [-2, 2]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 260, damping: 28 },
        opacity: { duration: 0.4 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 260, damping: 28 },
        opacity: { duration: 0.35 },
      },
    }),
  };

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setPage([page + 1, 1]);
    }, 4500);

    return () => clearInterval(timer);
  }, [page, isPaused]);

  const paginate = useCallback((newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  }, [page]);

  const handleDragEnd = (_: any, info: any) => {
    const swipeThreshold = 70;

    if (info.offset.x > swipeThreshold) {
      paginate(-1);
    } else if (info.offset.x < -swipeThreshold) {
      paginate(1);
    }

    x.set(0);
  };

  const goToDot = (index: number) => {
    const currentIndex = imageIndex;
    let steps = index - currentIndex;
    if (Math.abs(steps) > adSlides.length / 2) {
      steps = steps > 0 ? steps - adSlides.length : steps + adSlides.length;
    }
    setPage([page + steps, steps > 0 ? 1 : -1]);
  };

  const handleInteraction = () => {
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 15000);
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-black touch-pan-y"
      onPointerDown={handleInteraction}
      onTouchStart={handleInteraction}
    >
      <div className="relative w-full aspect-[4/1] sm:aspect-[5/1] md:aspect-[6/1] lg:aspect-[7/1] max-h-[160px] sm:max-h-[180px] md:max-h-[220px] lg:max-h-[260px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={handleDragEnd}
            style={{ x, rotate }}
            className="absolute inset-0 w-full h-full"
          >
            {adSlides[imageIndex].link ? (
              <a
                href={adSlides[imageIndex].link}
                className="block relative w-full h-full"
                onClick={handleInteraction}
              >
                <Image
                  src={adSlides[imageIndex].imageUrl}
                  alt={adSlides[imageIndex].alt}
                  fill
                  // Priority only for the very first image ever shown
                  priority={page === 0 && imageIndex === 0}
                  // Lazy load everything else
                  loading={page === 0 && imageIndex === 0 ? 'eager' : 'lazy'}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                  className="object-cover transition-transform duration-1000 ease-out hover:scale-[1.035] active:scale-100"
                  quality={85}
                />
              </a>
            ) : (
              <Image
                src={adSlides[imageIndex].imageUrl}
                alt={adSlides[imageIndex].alt}
                fill
                priority={page === 0 && imageIndex === 0}
                loading={page === 0 && imageIndex === 0 ? 'eager' : 'lazy'}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                className="object-cover transition-transform duration-1000 ease-out hover:scale-[1.035] active:scale-100"
                quality={85}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Preload the NEXT image (improves perceived performance) */}
        <link
          rel="preload"
          href={adSlides[nextIndex].imageUrl}
          as="image"
          fetchPriority="high"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3.5 sm:gap-4 z-10 px-4">
        {adSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              goToDot(index);
              handleInteraction();
            }}
            className={`
              w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full 
              transition-all duration-400 ease-out
              ${index === imageIndex
                ? 'bg-white scale-125 shadow-md shadow-white/50'
                : 'bg-white/50 hover:bg-white/80 active:bg-white'}
            `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}