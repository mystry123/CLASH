import Image from 'next/image'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex justify-center items-center flex-col  h-screen w-full'>
        <Image src='/not_found.svg' alt='404' width={900} height={900}  className='text-center'/>
     <Link href='/' className='text-orange-500 hover:underline'>Go back to home</Link>
    </div>
  )
}