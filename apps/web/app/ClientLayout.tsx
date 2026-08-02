'use client'
import React, { PropsWithChildren } from 'react'
import { Toaster } from 'sonner'

export const ClientLayout = (props: PropsWithChildren) => {
  return (
    <div>
        <Toaster />
        {props.children}
    </div>
  )
}