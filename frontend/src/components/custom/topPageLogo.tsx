export default function topPageLogo() {
    return (
        <div className='mt-8 mb-16 hover:rotate-180 hover:scale-105 transition duration-700 ease-in-out'>
            <svg
                xmlns='http://www.w3.org/2000/svg'
                width='160'
                height='160'
                viewBox='0 0 350 350'
            >
                <polygon points="0 0, 175 0, 175 175, 0 175" stroke="black" fill="#0000ff" />
                <polygon points="0 175, 175 175, 175 350, 0 350" stroke="black" fill="#ffc0cb" />
                <polygon points="175 0, 350 0, 350 175, 175 175" stroke="black" fill="#90EE90" />
                <polygon points="175 175, 350 175, 350 350, 175 350" stroke="black" fill="#ffff00" />
            </svg>
        </div>
    );
}