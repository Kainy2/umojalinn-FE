import { capitalizeFirstLetter } from '@/lib/string';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useRef } from 'react'
import Slider from 'react-slick';


const slickSettings = {
	dots: false,
	dotsClass: "slick-dots -translate-y-[9vh] md:-translate-y-[8vh]",
	// fade: true,
	draggable: false,
	infinite: false,
	// speed: 500,
	// slidesToShow: 1,
	// slidesToScroll: 1,
	swipeToSlide: false,
	swipe: false,
};

export const VariableDeliverySlider = ({
	selectedDeliveryMethod,
}: {
	selectedDeliveryMethod: string;
}) => {
	const selectedDeliveryMethodText = capitalizeFirstLetter(selectedDeliveryMethod).replaceAll("_", " ")
	const sliderRef = useRef<Slider | null>(null);
	

	return (
		<div className="my-2 p-4 rounded-md border border-gray-300 flex flex-col gap-1 text-gray-500 text-sm  md:max-w-prose 2xl:max-w-[90ch]">
			<Slider {...slickSettings} ref={sliderRef} className=""> 
				{/* page 1 */}
				<div className="space-y-3">
					<button 
						className='bg-gray-100 border-l border-gray-600 px-4 py-2 flex w-full items-center justify-between'
						onClick={() => sliderRef.current?.slickNext()}
					>
						<p> Input field Required for {selectedDeliveryMethodText} </p>
						<ChevronRight size={20} />
					</button>
					<div>
						<h6 className="font-semibold text-gray-600">Variable delivery</h6>
						<p>
							You can now adjust the price and delivery method for this milestone. Once accepted, the delivery method form will become active, allowing you to enter the required details. This step ensures that the client agrees with both the delivery method and the price.
						</p>
					</div>
				</div>

				{/* page 2 */}
				<div className="space-y-4">
					<button 
						className='gap-2 py-2 flex items-center justify-between font-semibold'
						onClick={() => sliderRef.current?.slickPrev()}
					>
						<ChevronLeft size={20} />
						<p> Back </p>
					</button>
					<p className='text-sm text-grey-500'>
						Necessary information required for {selectedDeliveryMethodText} after delivery method is approved
					</p>
					<div className='pt-4 flex flex-row items-center'>
						<span className="border-t flex-1" />
						<p className='text-sm text-grey-500 capitalize'>{selectedDeliveryMethodText} Information</p>
						<span className="border-t flex-1" />
					</div>
					<div className='flex flex-col gap-3'>
						{[
							{
								title: "Country",
								value: "-",
								allowedDeliveryMethods: ["IN_PERSON_PICKUP"],
							},
							{
								title: "State and Province",
								value: "-",
								allowedDeliveryMethods: ["IN_PERSON_PICKUP"],
							},
							{
								title: "Zip Code / Postal Code",
								value: "-",
								allowedDeliveryMethods: ["IN_PERSON_PICKUP"],
							},
							{
								title: "Street/Apartment/suits",
								value: "-",
								allowedDeliveryMethods: ["IN_PERSON_PICKUP"],
							},
							{
								title: "Courier Service",
								value: "-",
								allowedDeliveryMethods: [
									"TRACKED",
									"NON_TRACKED",
								],
							},
							{
								title: "Tracking Link",
								value: "-",
								allowedDeliveryMethods: ["TRACKED"],
							},
							{
								title: "Tracking ID",
								value: "-",
								allowedDeliveryMethods: ["TRACKED"],
							},
							{
								title: "Other Information",
								value: "-",
								allowedDeliveryMethods: [
									"TRACKED",
									"NON_TRACKED",
								],
							},
						]
							.filter(({ allowedDeliveryMethods }) => allowedDeliveryMethods.includes(selectedDeliveryMethod))
							.map(({ value, title }) => (
								<div key={title} className='flex gap-3 justify-between items-center'>
									<p className="font-semibold">{title}</p>
									<p>{value}</p>
								</div>
							))}
					</div>
				</div>
			</Slider>
		</div>
	)
}
