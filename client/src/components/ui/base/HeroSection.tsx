import React from 'react'
import Image from 'next/image'
import { Button } from '../button'

export default function HeroSection() {
  return (
    <div className='w-full h-screen flex justify-center items-center flex-col'>
      <div className='text-center'>
        <Image src='/banner_img.svg' width={600} height={600} alt='bannner image' />
      </div>
      <div className='text-center mt-3'>
        <h1 className='text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-[#c21500] to-[#ffc500] text-transparent bg-clip-text text-center'>
            BATTLE
        </h1>
        <p className='text-2xl md:text-3xl lg:text-4xl font-bold text-center'>
            Discover the better choice together 
        </p>
        <Button className='mt-5'>Get Started</Button>
      </div>
    </div>
  )
}
