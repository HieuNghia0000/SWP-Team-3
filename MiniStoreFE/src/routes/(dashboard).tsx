export default function Page() {
  return (
    <div class="text-white" style="height:222px">
      <div class="w-full p-8">
        <div class="px-4">
          <div class="flex flex-wrap items-center justify-between">
            <div>
              <h1 class="text-4x1 mb-1 font-medium rtl:flex rtl:justify-end LR">
                Hello Bae
              </h1>
              <p class="mb-4 LR rtl:text-right">"Tuần 7 rồi uhuhu"</p>
            </div>
            <div>
              <a class="inline-block px-6 py-2 mb-4 text-center text-white transition-all duration-500 ease-in-out border border-transparent rounded shadow-md btn-soft-light hover:shadow-xl hover:bg-glass focus:bg-gray-200">
                <svg
                  width="20"
                  class="inline-block"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.8251 15.2171H12.1748C14.0987 15.2171 15.731 13.985 16.3054 12.2764C16.3887 12.0276 16.1979 11.7713 15.9334 11.7713H14.8562C14.5133 11.7713 14.2362 11.4977 14.2362 11.16C14.2362 10.8213 14.5133 10.5467 14.8562 10.5467H15.9005C16.2463 10.5467 16.5263 10.2703 16.5263 9.92875C16.5263 9.58722 16.2463 9.31075 15.9005 9.31075H14.8562C14.5133 9.31075 14.2362 9.03619 14.2362 8.69849C14.2362 8.35984 14.5133 8.08528 14.8562 8.08528H15.9005C16.2463 8.08528 16.5263 7.8088 16.5263 7.46728C16.5263 7.12575 16.2463 6.84928 15.9005 6.84928H14.8562C14.5133 6.84928 14.2362 6.57472 14.2362 6.23606C14.2362 5.89837 14.5133 5.62381 14.8562 5.62381H15.9886C16.2483 5.62381 16.4343 5.3789 16.3645 5.13113C15.8501 3.32401 14.1694 2 12.1748 2H11.8251C9.42172 2 7.47363 3.92287 7.47363 6.29729V10.9198C7.47363 13.2933 9.42172 15.2171 11.8251 15.2171Z"
                    fill="currentColor"
                  ></path>
                  <path
                    opacity="0.4"
                    d="M19.5313 9.82568C18.9966 9.82568 18.5626 10.2533 18.5626 10.7823C18.5626 14.3554 15.6186 17.2627 12.0005 17.2627C8.38136 17.2627 5.43743 14.3554 5.43743 10.7823C5.43743 10.2533 5.00345 9.82568 4.46872 9.82568C3.93398 9.82568 3.5 10.2533 3.5 10.7823C3.5 15.0873 6.79945 18.6413 11.0318 19.1186V21.0434C11.0318 21.5715 11.4648 22.0001 12.0005 22.0001C12.5352 22.0001 12.9692 21.5715 12.9692 21.0434V19.1186C17.2006 18.6413 20.5 15.0873 20.5 10.7823C20.5 10.2533 20.066 9.82568 19.5313 9.82568Z"
                    fill="currentColor"
                  ></path>
                </svg>
                F for respect
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        class="absolute top-0 lg:h-64 h-72 overflow-hidden rounded-xl"
        style="z-index: -1;"
      >
        <img
          src="../public/top-header.png"
          alt="header"
          class="animated-scaleX object-cover w-screen h-full rounded-2xl"
        ></img>
      </div>

      <div class="p-6 py-0 lg:p-10 lg:py-0 md:-mt-14 footer-inner">
        <div>
          <div
            x-data="{swiper: null}"
            x-init="swiper = new Swiper($refs.container, {
       centeredSlides: false,
       loop: false,
       slidesPerView: 4,
      autoplay:false,
      spaceBetween: 32,
      breakpoints: {
        280: {slidesPerview: 1},
        300: { slidesPerView: 1 },
        550: { slidesPerView: 2 },
        991: { slidesPerView: 3 },
        1400: { slidesPerView: 4 },
        1500: { slidesPerView: 4 },
        1600: { slidesPerView: 5 },
        1980: { slidesPerView: 5 },
        2040: { slidesPerView: 6 },
        2440: { slidesPerView: 6 },
      },
      navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
      },
      })"
            class="relative flex flex-row LR lg:-mt-14 sm:-mt-8 mt-12"
          >
            <div
              class="swiper-button swiper-button-next absolute left-auto right-0 top-1/3 h-[30px] w-[30px] after:content-['next'] after:text-gray-500"
              style="--swiper-navigation-size: .75rem"
            ></div>
            <div
              class="swiper-button swiper-button-prev absolute right-auto left-0 top-1/3 h-[30px] w-[30px] after:content-['prev'] after:text-gray-500"
              style="--swiper-navigation-size: .75rem"
            ></div>
          </div>
          <div
            class="swiper-container swiper-container-initialized swiper-container-horizontal swiper-container-pointer-events"
            x-ref="contain er"
          >
            <div
              class="swiper-wrapper"
              id="swiper-wrapper-8839048107a92a8f7"
              aria-live="polite"
              style="transition-duration: 0ms; transform: translate3d(0px, 0px, 0px);"
            >
              <div
                class="pt-0 pb-0 mb-8 swiper-slide aos-init aos-animate swiper-slide-active"
                data-aos="fade-up"
                data-aos-duration="700"
                style="width: 287.2px; margin-right: 32px;"
                role="group"
                aria-label="1 / 7"
              >
                <div class="relative flex flex-col overflow-hidden bg-white rounded-lg shadow-lg dark:bg-dark-card">
                  <div class="flex-shrink-0 p-6 RL">
                    <div class="flex items-center">
                      <div class="inline-flex items-center justify-center overflow-hidden rounded-full bottom-5 ltr:left-5 rtl:right-5">
                        <svg class="w-20 h-20">
                          <circle
                            class="text-gray-400 dark:text-gray-600"
                            stroke-width="3"
                            stroke="currentColor"
                            fill="transparent"
                            r="30"
                            cx="40"
                            cy="40"
                          ></circle>
                          <circle
                            class="text-cyan-400"
                            stroke-width="5"
                            stroke-dasharray="360" 
                            stroke-dashoffset="200"
                            stroke-linecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="30"
                            cx="40"
                            cy="40"
                          ></circle>
                        </svg>
                        <svg
                          class="absolute text-gray-600 card-slide-arrow"
                          width="24"
                          height="24px"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z"
                          ></path>
                        </svg>
                      </div>
                      <div class="ml-6 rtl:ml-0 rtl:mr-6 ">
                        <p class="mb-2 text-gray-600 dark:text-gray-600">
                          Total Sales
                        </p>
                        <h4
                          class="text-2xl font-medium dark:text-gray-600 counter"
                          style="visibility: visible;"
                        >
                          $560K
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="pt-0 pb-0 mb-8 swiper-slide aos-init aos-animate swiper-slide-next"
                data-aos="fade-up"
                data-aos-duration="800"
                style="width: 287.2px; margin-right: 32px;"
                role="group"
                aria-label="2 / 7"
              >
                <div class="flex flex-col overflow-hidden bg-white rounded-lg shadow-lg dark:bg-dark-card">
                  <div class="flex-shrink-0 p-6 RL">
                    <div class="flex items-center">
                      <div class="inline-flex items-center justify-center overflow-hidden rounded-full bottom-5 left-5">
                        <svg class="w-20 h-20">
                          <circle
                            class="text-gray-400 dark:text-gray-600"
                            stroke-width="3"
                            stroke="currentColor"
                            fill="transparent"
                            r="30"
                            cx="40"
                            cy="40"
                          ></circle>
                          <circle
                            class="text-cyan-400"
                            stroke-width="5"
                            stroke-linecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="30"
                            cx="40"
                            cy="40"
                            stroke-dasharray="360"
                            stroke-dashoffset="200"
                          ></circle>
                          <circle
                            class="text-cyan-400"
                            stroke-width="5"
                            stroke-dasharray="360"
                            stroke-dashoffset="200"
                            stroke-linecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="30"
                            cx="40"
                            cy="40"
                            stroke-dasharray2="360"
                            stroke-dashoffset2="200"
                          ></circle>
                        </svg>
                        <svg
                          class="absolute text-gray-600 card-slie-arrow"
                          width="24"
                          height="24px"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M19,6.41L17.59,5L7,15.59V9H5V19H15V17H8.41L19,6.41Z"
                          ></path>
                        </svg>
                      </div>
                      <div class="ml-6 rtl:ml-0 rtl:mr-6">
                        <p class="mb-2 text-gray-600 dark:text-gray-600">
                          Total Profit
                        </p>
                        <h4 class="text-2xl font-medium dark:text-gray-600 counter">
                          $185K
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="pt-0 pb-0 mb-8 swiper-slide"
                data-aos="fade-up"
                data-aos-duration="900"
              >
                <div class="flex flex-col overflow-hidden bg-white rounded-lg shadow-lg dark:bg-dark-card">
                  <div class="flex-shrink-0 p-6 RL">
                    <div class="flex items-center">
                      <div class="inline-flex items-center justify-center overflow-hidden rounded-full bottom-5 left-5">
                        <svg class="w-20 h-20">
                          <circle
                            class="text-gray-400 dark:text-gray-600"
                            stroke-width="3"
                            stroke="currentColor"
                            fill="transparent"
                            r="30"
                            cx="40"
                            cy="40"
                          />
                          <circle
                            class="text-blue-500"
                            stroke-width="5"
                            stroke-linecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="30"
                            cx="40"
                            cy="40"
                          />
                        </svg>
                        <svg
                          class="absolute text-gray-600 card-slie-arrow"
                          width="24"
                          height="24px"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M19,6.41L17.59,5L7,15.59V9H5V19H15V17H8.41L19,6.41Z"
                          ></path>
                        </svg>
                      </div>
                      <div class="ml-6 rtl:ml-0 rtl:mr-6">
                        <p class="mb-2 text-gray-600 dark:text-gray-600">
                          Total Cost
                        </p>
                        <h4
                          class="text-2xl font-medium dark:text-gray-600 counter"
                          style="visibility: visible;"
                        >
                          $375K
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="pt-0 pb-0 mb-8 swiper-slide"
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                <div class="flex flex-col overflow-hidden bg-white rounded-lg shadow-lg dark:bg-dark-card">
                  <div class="flex-shrink-0 p-6 RL">
                    <div class="flex items-center">
                      <div class="inline-flex items-center justify-center overflow-hidden rounded-full bottom-5 left-5">
                        <svg class="w-20 h-20">
                          <circle
                            class="text-gray-400 dark:text-gray-600"
                            stroke-width="3"
                            stroke="currentColor"
                            fill="transparent"
                            r="30"
                            cx="40"
                            cy="40"
                          />
                          <circle
                            class="text-cyan-400"
                            stroke-width="5"
                            stroke-dasharray="360"
                            stroke-dashoffset="200"
                            stroke-linecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="30"
                            cx="40"
                            cy="40"
                          />
                        </svg>
                        <svg
                          class="absolute text-gray-600 card-slie-arrow"
                          width="24"
                          height="24px"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z"
                          ></path>
                        </svg>
                      </div>
                      <div class="ml-6 rtl:ml-0 rtl:mr-6">
                        <p class="mb-2 text-gray-600 dark:text-gray-600">
                          Revenue
                        </p>
                        <h4 class="text-2xl font-medium dark:text-gray-600 counter">
                          $742K
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="pt-0 pb-0 mb-8 swiper-slide"
                data-aos="fade-up"
                data-aos-duration="1100"
              >
                <div class="flex flex-col overflow-hidden bg-white rounded-lg shadow-lg dark:bg-dark-card">
                  <div class="flex-shrink-0 p-6 RL">
                    <div class="flex items-center">
                      <div class="inline-flex items-center justify-center overflow-hidden rounded-full bottom-5 left-5">
                        <svg class="w-20 h-20">
                          <circle
                            class="text-gray-400 dark:text-gray-600"
                            stroke-width="3"
                            stroke="currentColor"
                            fill="transparent"
                            r="30"
                            cx="40"
                            cy="40"
                          />
                          <circle
                            class="text-blue-500"
                            stroke-width="5"
                            stroke-dasharray="360"
                            stroke-dashoffset="200"
                            stroke-linecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="30"
                            cx="40"
                            cy="40"
                          />
                        </svg>
                        <svg
                          class="absolute text-gray-600 card-slie-arrow"
                          width="24"
                          height="24px"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z"
                          ></path>
                        </svg>
                      </div>
                      <div class="ml-6 rtl:ml-0 rtl:mr-6">
                        <p class="mb-2 text-gray-600 dark:text-gray-600">
                          Net Income
                        </p>
                        <h4 class="text-2xl font-medium dark:text-gray-600 counter">
                          $150K
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="pt-0 pb-0 mb-8 swiper-slide"
                data-aos="fade-up"
                data-aos-duration="1200"
              >
                <div class="flex flex-col overflow-hidden bg-white rounded-lg shadow-lg dark:bg-dark-card">
                  <div class="flex-shrink-0 p-6 RL">
                    <div class="flex items-center">
                      <div class="inline-flex items-center justify-center overflow-hidden rounded-full bottom-5 left-5">
                        <svg class="w-20 h-20">
                          <circle
                            class="text-gray-400 dark:text-gray-600"
                            stroke-width="3"
                            stroke="currentColor"
                            fill="transparent"
                            r="30"
                            cx="40"
                            cy="40"
                          />
                          <circle
                            class="text-cyan-400"
                            stroke-width="5"
                            stroke-dasharray="360"
                            stroke-dashoffset="200"
                            stroke-linecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="30"
                            cx="40"
                            cy="40"
                          />
                        </svg>
                        <svg
                          class="absolute text-gray-600 card-slie-arrow"
                          width="24"
                          height="24px"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M19,6.41L17.59,5L7,15.59V9H5V19H15V17H8.41L19,6.41Z"
                          ></path>
                        </svg>
                      </div>
                      <div class="ml-6 rtl:ml-0 rtl:mr-6">
                        <p class="mb-2 text-gray-600 dark:text-gray-600">
                          Today
                        </p>
                        <h4 class="text-2xl font-medium dark:text-gray-600 counter">
                          $4600
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
