import illustration from '../assets/illustration-empty.svg';
const EmptyInvoice = () => {
    return (
        <section className='flex flex-col justify-center items-center my-20 px-12 text-center'>
            <img src={illustration} alt="illustration" className='mb-8'/>
            <h2 className='font-bold text-2xl mb-4 dark:text-white'>There is nothing here</h2>
            <p className='text-[13px] leading-3.5 text-[#888EB0] dark:text-[#DFE3FA]'>Create an invoice by clicking the new button and getting started</p>


        </section>
    )
}

export default EmptyInvoice;