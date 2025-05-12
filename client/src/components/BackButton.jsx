import arrow_left from '../assets/icon-arrow-left.svg'
const BackButton = ({ onClick }) => {
    return (
        <button onClick={onClick} className='flex flex-row items-center font-bold cursor-pointer mb-5 dark:text-white'>
            <img src={arrow_left} alt="go back icon" className='mr-4'/>
            Go back

        </button>
    )
}

export default BackButton;