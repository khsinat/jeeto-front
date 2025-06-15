
const Banner = () => {
    return (
        <div className="flex flex-1 max-h-[40vh] rounded-xl bg-gradient-to-bl from-[#ffe4e6]  to-[#ccfbf1] col-span-2 " >
            <div className='flex flex-col bg-blue-200 p-2 gap-2 h-full w-[200px]  rounded-l-xl '>
                <div className='flex flex-1 bg-red-200 items-center justify-center h-1/2 p-2'>
                    <h1 className='text-xl font-bold'>Login to collect your daily points!</h1>
                </div>
                <div className='flex h-[60px] bg-green-200 items-center justify-center h-1/2'>
                    <p className='text-lg'>Enjoy your stay</p>
                </div>
            </div>
        </div>
    )
}

export default Banner