import { capitalizeFirstLetter, getCurrencySymbol } from '@/lib/string';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { ReactNode, useState } from 'react'
// import { Settings } from 'react-slick';
import { EmptyDeliveryDetails } from './DeliveryDetails';
import { UmojaLinnCurrency, UmojaLinnDeliveryMethod } from '@/types/project';
import { formatCurrencyValue } from '@/lib/number';


// const slickSettings:Settings = {
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

export const VariableDecisionDetailsSlider = ({
	deliveryMethod,
	price,
	currency = "EURO",
}: {
	deliveryMethod: UmojaLinnDeliveryMethod;
	price: number;
	currency: UmojaLinnCurrency;
}) => {
	const deliveryMethodText = capitalizeFirstLetter(deliveryMethod).replaceAll("_", " ")
	const [currentPage, setCurrentPage] = useState(1);
	

	return (
		<div className="my-2 py-4 rounded-md w-full  text-gray-500 text-sm">
				{/* page 1 */}
			{currentPage === 1 && (
				<div className='px-0.5'>
					<div className="p-2 flex flex-col md:flex-row gap-3 rounded-md border border-gray-300 justify-evenly">
						<VariableDeliveryInfo
							title="Delivery Method"
							value={deliveryMethodText} 
						/>
	
						<div aria-label="separator" className='border-l border-gray-200 md:block hidden' />
						<hr aria-label="separator" className='border-gray-200 md:hidden block w-full'/>
						
						<VariableDeliveryInfo
							title="New Price"
							value={getCurrencySymbol(currency) + formatCurrencyValue(price)} 
						/>

						<div aria-label="separator" className='border-l border-gray-200 md:block hidden' />
						<hr aria-label="separator" className='border-gray-200 md:hidden w-full'/>

						<VariableDeliveryInfo
							title="More Details"
							value={
									<button
										className="text-primary flex items-center justify-between"
										onClick={() => setCurrentPage(2)}
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
				)}

				{/* page 2 */}
			{currentPage === 2 && (
				<div className='px-0.5'>
					<div className="space-y-4 rounded-md border border-gray-300 p-2">
						<button 
							className='gap-2 py-2 flex items-center justify-between font-semibold'
							onClick={() => setCurrentPage(1)}
						>
							<ChevronLeft size={20} />
							<p> Back </p>
						</button>
						<p className='text-sm text-grey-500'>
							Designer will fill in the necessary information required for <b>{deliveryMethodText}</b> after delivery method is approved
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
			)}
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
