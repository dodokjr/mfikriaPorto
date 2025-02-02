import React from 'react'
import LoadingAs from '../../../assets/documents/Mfikria.svg';

export default function Loading() {
  return (
      <div class="relative h-screen flex justify-center items-center">
    <div class="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
    <img src={LoadingAs}  class="rounded-full h-36 w-36" />
</div>
  )
}
