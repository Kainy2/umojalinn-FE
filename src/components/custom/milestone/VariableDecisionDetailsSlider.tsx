import { capitalizeFirstLetter } from '@/lib/string';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { ReactNode, useRef } from 'react'
import Slider, { Settings } from 'react-slick';
import { EmptyDeliveryDetails } from './DeliveryDetails';
import { UmojaLinnDeliveryMethod } from '@/types/project';


const slickSettings:Settings = {
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

export const VariableDecisionDetailsSlider = ({
	deliveryMethod,
	price
}: {
	deliveryMethod: UmojaLinnDeliveryMethod;
	price: number
}) => {
	const deliveryMethodText = capitalizeFirstLetter(deliveryMethod).replaceAll("_", " ")
	const sliderRef = useRef<Slider | null>(null);
	

	return (
		<div className="my-2 py-4 rounded-md w-full overflow-hidden text-gray-500 text-sm md:max-w-prose 2xl:max-w-[90ch]">
			<Slider {...slickSettings} ref={sliderRef} className=""> 
				{/* page 1 */}
				<div className='px-0.5'>
					<div className="p-2 flex flex-col md:flex-row gap-3 rounded-md border border-gray-300 justify-evenly">
						<VariableDeliveryInfo
							title="Delivery Method"
							value={deliveryMethodText} 
						/>
	
						<div aria-label="separator" className='border-l border-gray-200 md:block hidden' />
						<hr aria-label="separator" className='border-gray-200 md:hidden block w-full'/>
						
						<VariableDeliveryInfo
							title="Price"
							value={price} 
						/>

						<div aria-label="separator" className='border-l border-gray-200 md:block hidden' />
						<hr aria-label="separator" className='border-gray-200 md:hidden w-full'/>

						<VariableDeliveryInfo
							title="More Details"
							value={
									<button
										className="text-primary flex items-center justify-between"
										onClick={() => sliderRef.current?.slickNext()}
									>
										<p>View details</p>
										<ChevronRight size={20} />
									</button>
							}
						/>

						{/* <button 
							className='bg-gray-100 border-l border-gray-600 px-4 py-2 flex w-full items-center justify-between'
							onClick={() => sliderRef.current?.slickNext()}
						>
							<p>View  details</p>
							<ChevronRight size={20} />
						</button>
						<div>
							<h6 className="font-semibold text-gray-600">Variable delivery</h6>
							<p>
								You can now adjust the price and delivery method for this milestone. Once accepted, the delivery method form will become active, allowing you to enter the required details. This step ensures that China agrees with both the delivery method and the price.
							</p>
						</div> */}
					</div>

				</div>

				{/* page 2 */}
				<div className='px-0.5'>
					<div className="space-y-4 rounded-md border border-gray-300 p-2">
						<button 
							className='gap-2 py-2 flex items-center justify-between font-semibold'
							onClick={() => sliderRef.current?.slickPrev()}
						>
							<ChevronLeft size={20} />
							<p> Back </p>
						</button>
						<p className='text-sm text-grey-500'>
							Necessary information required for <b>{deliveryMethodText}</b> after delivery method is approved
						</p>
						<div className='pt-4 flex flex-row items-center'>
							<span className="border-t flex-1" />
							<p className='text-sm text-grey-500 capitalize'>{deliveryMethodText} Information</p>
							<span className="border-t flex-1" />
						</div>

						<div className='md:px-2'>
							<EmptyDeliveryDetails currentDeliveryMethod={deliveryMethod} />
						</div>
					</div>
				</div>
			</Slider>
		</div>
	)
}

const VariableDeliveryInfo = ({ title, value }: {title: string, value: ReactNode}) =>{
	return (
		<div className='flex flex-col  gap-3 text-normal font-semibold '>
			<h6 className='text-gray-400'>
				{title}
			</h6>
			<p className='text-gray-700'>
				{value}
			</p>
		</div>
	)
}
