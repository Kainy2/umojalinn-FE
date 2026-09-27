import { capitalizeFirstLetter } from "@/lib/string";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { DeliveryDetails, EmptyDeliveryDetails } from "./DeliveryDetails";
import { UmojaLinnDeliveryMethod } from "@/types/project";
// import Slider from 'react-slick';

// const slickSettings = {
// 	dots: false,
// 	dotsClass: "slick-dots -translate-y-[9vh] md:-translate-y-[8vh]",
// 	// fade: true,
// 	draggable: false,
// 	infinite: false,
// 	// speed: 500,
// 	// slidesToShow: 1,
// 	// slidesToScroll: 1,
// 	swipeToSlide: false,
// 	swipe: false,
// };

export const VariableDeliverySlider = ({
  selectedDeliveryMethod,
  hasFinalisedVariableSubmission,
}: {
  selectedDeliveryMethod: UmojaLinnDeliveryMethod;
  hasFinalisedVariableSubmission: boolean;
}) => {
  const selectedDeliveryMethodText = capitalizeFirstLetter(
    selectedDeliveryMethod,
  ).replaceAll("_", " ");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="my-2 p-4 rounded-md border border-gray-300 text-gray-500 text-sm ">
      {/* <div className="my-2 py-4 rounded-md w-full overflow-hidden text-gray-500 text-sm"> */}

      {/* page 1 */}
      {currentPage === 1 && (
        <div className="space-y-3">
          <button
            className="bg-gray-100 border-l border-gray-600 px-4 py-2 flex w-full items-center justify-between"
            onClick={() => setCurrentPage(2)}
          >
            <p> Fields Required for {selectedDeliveryMethodText} </p>
            <ChevronRight size={20} />
          </button>
          <div>
            <h6 className="font-semibold text-gray-600">Variable delivery</h6>
            <p>
              You can now adjust the price and delivery method for this
              milestone. Once accepted, the delivery method form will become
              active, allowing you to enter the required details. This step
              ensures that the client agrees with both the delivery method and
              the price.
            </p>
          </div>
        </div>
      )}

      {/* page 2 */}
      {currentPage === 2 && (
        <div className="space-y-4">
          <button
            className="gap-2 py-2 flex items-center justify-between font-semibold"
            onClick={() => setCurrentPage(1)}
          >
            <ChevronLeft size={20} />
            <p> Back </p>
          </button>
          <p className="text-sm text-grey-500">
            Necessary information required for {selectedDeliveryMethodText}{" "}
            after delivery method is approved
          </p>
          <div className="pt-4 flex flex-row items-center">
            <span className="border-t flex-1" />
            <p className="text-sm text-grey-500 capitalize">
              {selectedDeliveryMethodText} Information
            </p>
            <span className="border-t flex-1" />
          </div>

          {hasFinalisedVariableSubmission ? (
            <DeliveryDetails deliveryMethod={selectedDeliveryMethod} />
          ) : (
            <EmptyDeliveryDetails
              currentDeliveryMethod={selectedDeliveryMethod}
            />
          )}
        </div>
      )}
    </div>
  );
};
