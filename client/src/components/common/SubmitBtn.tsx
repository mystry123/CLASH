'use client'
 
import { useFormStatus } from 'react-dom'
import { Button } from '../ui/button'
 
export function SubmitButton() {
  const { pending } = useFormStatus()
 
  return (
    <Button  className="w-full " disabled={pending}>
    <span className=" bg-gradient-to-r from-[#c21500] to-[#ffc500] text-transparent bg-clip-text">{pending? "Processing.." : "Submit" }</span>
  </Button>
  )
}