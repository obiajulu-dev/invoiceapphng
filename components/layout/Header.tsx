'use client';

import { ThemeToggle } from './ThemeToggle';

export const Header = () => {
    return (

        <header className="fixed top-0 left-0 z-40 flex h-[52px] w-full items-center bg-[#373b53] dark:bg-[#1e2139] lg:h-full lg:w-[80px] lg:flex-col lg:rounded-r-[20px] overflow-hidden">


            <div className="relative flex h-[52px] w-[72px] items-center justify-center overflow-hidden rounded-r-[20px] bg-[var(--accent-primary)] lg:h-[103px] lg:w-[80px] lg:rounded-tr-[20px] lg:rounded-br-[20px] shrink-0">
                <div className="absolute bottom-0 left-0 h-1/2 w-full rounded-tl-[20px] bg-[var(--accent-hover)]" />
                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="29" className="relative z-10 lg:w-10 lg:h-9">
                    <path fill="#FFF" fillRule="nonzero" d="M20 37.71A20 20 0 1 1 40 17.71h-20v20Z" transform="scale(0.75) lg:scale(1)" />
                </svg>
            </div>


            <div className="flex-1" />


            <div className="flex items-center lg:flex-col">
                <div className="px-6 lg:px-0 lg:pb-8 flex justify-center">
                    <ThemeToggle />
                </div>


                <div className="h-[72px] border-l border-[#494e6e] lg:h-auto lg:w-full lg:border-t lg:border-l-0" />

                <div className="px-6 py-6 lg:px-0 lg:py-8 flex justify-center">
                    <img
                        src="/images/image-avatar.png"
                        alt="User avatar"
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-full"
                    />
                </div>
            </div>
        </header>
    );
};