import { useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';

const Modal = ({ show, setShow, children, height, width, notFull }) => {
	useEffect(() => {
		show
			? document.querySelector('body').classList.add('overflow-hidden')
			: document
					.querySelector('body')
					.classList.remove('overflow-hidden');
	}, [show]);
	return (
		<>
			<div
				className={`fixed inset-0 z-50 flex justify-center transition-all ${
					show
						? 'opacity-100 pointer-events-auto delay-75'
						: 'opacity-0 pointer-events-none'
				}`}>
				<div
					className='absolute inset-0 bg-black bg-opacity-50 z-10 backdrop-blur-md'
					onClick={() => {
						setShow();
					}}></div>
				<button
					className='p-2 hover:bg-white rounded-full text-gray-900 bg-gray-100 transition-all absolute right-5 top-5 z-30'
					onClick={setShow}>
					<FiPlus className='rotate-45 text-2xl font-bold' />
				</button>
				<div
					className={`max-h-[95vh] overflow-hidden w-full bg-white rounded-xl mt-[2.5vh] flex z-20 container transition-all ${
						show ? 'scale-[1] delay-75' : 'scale-[0.95]'
					} ${notFull && 'self-start'}
					`}
					style={{
						height,
						width,
					}}>
					{children}
				</div>
			</div>
		</>
	);
};

export default Modal;
