"use client";

import React , {useEffect} from 'react'
import { SubmitButton } from '../common/SubmitBtn'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { registerAction } from '@/actions/authActions'
import { useFormState } from 'react-dom'
import { toast } from 'sonner';


export default function Register() {
    const initialState = {
        status: "",
        message: "",
        errors: {},
    }

    const [state , formAction] = useFormState(registerAction,initialState)

    useEffect(() => {
        if(state.status === 500) {
            toast.error(state.message)
        } else if (state.status === 200) {
            toast.success(state.message)
        } else if (state.status === 400) {
            toast.error(state.message)
        }
    } 
    ,[state.status])

  return (
    <div>
       <form action={formAction}>
          <div className="mt-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email..."
            />
            <span className="text-red-500">{state.errors?.email}</span>
          </div>
          <div className="mt-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name..."
            />
             <span className="text-red-500">{state.errors?.username}</span>
          </div>
          <div className="mt-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password..."
            />
            <span className="text-red-500">{state.errors?.password}</span>
          </div>
          <div className="mt-4">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password..."
            />
            <span className="text-red-500">{state.errors?.confirmPassword}</span>
          </div>
          <div className="mt-4">
            <SubmitButton/>
          </div>
        </form>
    </div>
  )
}
