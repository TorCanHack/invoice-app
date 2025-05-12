import icon from '../assets/logo.svg'
import sun from '../assets/icon-sun.svg'
import moon from '../assets/icon-moon.svg'
import avatar from '../assets/image-avatar.jpg'
import { useTheme } from './useTheme'
const Header = () => {
    const {theme, setTheme} = useTheme()

    return(
        <header className="relative z-30 flex flex-row justify-between items-center bg-[#373B53] h-[72px] lg:flex-col lg:h-screen lg:w-[103px] lg:pb-6 lg:fixed">
            <div className='flex flex-row justify-between border-r border-[#494E6E] w-72 md:w-[740px] lg:flex-col lg:w-full lg:h-[730px] lg:border-b lg:pb-4'>
                <div className='h-[72px] w-[72px] bg-[#7C5DFA] rounded-r-3xl flex flex-col justify-end overflow-hidden lg:h-[103px] lg:w-[103px]'>
                    <div className='bg-[#9277FF] h-[38px] flex flex-col justify-center items-center rounded-tl-3xl lg:h-14'>
                        <img src={icon} alt="logo" className='relative bottom-4 lg:h-8 lg:w-8 lg:bottom-5'/>

                    </div>
                    

                </div>

                <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className='cursor-pointer mr-4 lg:flex lg:flex-col lg:items-center' >
                    {theme === "light" ? <img src={moon} alt='moon icon'/> : <img src={sun} alt='sun icon'/>}
                </button>
            </div>

            <img src={avatar} alt="avatar" className='h-8 w-8 rounded-full mr-4' />
           

        </header>
    )
}

export default Header;