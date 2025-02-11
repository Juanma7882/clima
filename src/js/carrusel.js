export function initSwiper() {

    return new Swiper('.card-wrapper', {
        spaceBetween: 20,
        direction: 'horizontal',
        freeMode: true,
        with: 100,
        grabCursor: true,

        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },

        // Navigation arrows
        navigation: {
        },

        breakpoints: {
            0: {
                slidesPerView: 1
            },
            192: {
                slidesPerView: 1.5
            },

            280: {
                slidesPerView: 3
            },
            425: {
                slidesPerView: 3.5
            },
            768: {
                slidesPerView: 4
            },
            1024: {
                slidesPerView: 6.5,
            },
            1440: {
                slidesPerView: 6.5
            }
        }
    });
}
