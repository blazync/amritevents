
  // Loader
    document.addEventListener("DOMContentLoaded", function () {
      document.body.classList.add('loaded');
    });


// Hero Section Slider
const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  speed: 2000,
  autoplay: {
    enabled: true,
    delay: 4000,
  },
});


// Testimonial Slider
var swiperTestimonial = new Swiper(".swiperTestimonial", {
      slidesPerView: 2,
      spaceBetween: 0,
      loop: true,
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 0,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 0,
        },
        1024: {
          slidesPerView: 2,
          spaceBetween: 0,
        },
      },
    });





  // ===== Faq accordion
  const faqs = document.querySelectorAll(".single-faq");
  faqs.forEach((el) => {
    el.querySelector(".faq-btn").addEventListener("click", () => {
      el.querySelector(".icon").classList.toggle("rotate-180");
      el.querySelector(".faq-content").classList.toggle("hidden");
    });
  });





  