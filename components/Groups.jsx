import Image from 'next/image';
import { BsThreeDots } from 'react-icons/bs';

const Groups = () => {
	return (
		<>
			<div className='bg-white p-5 rounded-xl shadow mt-5'>
				<div className='flex justify-between items-center'>
					<p className='font-semibold'>My Groups</p>
					<BsThreeDots />
				</div>
				<div className='mt-5'>
					<div className='flex'>
						<Image
							src='https://img.freepik.com/free-vector/group-therapy-illustration_74855-5516.jpg?w=2000'
							alt='image'
							className='rounded'
							width='30px'
							height='30px'
						/>
						<p className='ml-3' style={{ lineHeight: '30px' }}>
							Family
						</p>
					</div>
					<div className='flex mt-3'>
						<Image
							src='https://img.freepik.com/free-vector/group-therapy-illustration_23-2148662109.jpg?w=2000&t=st=1665497080~exp=1665497680~hmac=475d10991a103b41c6f667ff0e84ba0467ffc0ba02cda1fe583fbd0f4288e685'
							alt='image'
							className='rounded'
							width='30px'
							height='30px'
						/>
						<p className='ml-3'>Friends</p>
					</div>
					<div className='flex mt-3'>
						<Image
							src='https://img.freepik.com/free-vector/group-therapy-illustration-concept_52683-45727.jpg?w=2000&t=st=1665497106~exp=1665497706~hmac=e9312127baef1bbf3b0e52aec2f680587801cafd05e17aa5c34516337d94b021'
							alt='image'
							className='rounded'
							width='30px'
							height='30px'
						/>
						<p className='ml-3'>Party</p>
					</div>
					<div className='flex mt-3'>
						<Image
							src='https://img.freepik.com/free-vector/college-university-students-group-young-happy-people-standing-isolated-white-background_575670-66.jpg?w=1800&t=st=1665497132~exp=1665497732~hmac=8bd76dce1457f319ea06e97fa5a4299673b2589c392198027504e0cb57ecd576'
							alt='image'
							className='rounded'
							width='30px'
							height='30px'
						/>
						<p className='ml-3'>Randoms</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default Groups;
