"use client";

import React from 'react';
import BookingComponent from '@/components/AppComponent/bookComponent';
import BackButton from '@/components/ui/buttons/BackButton';

const Page = () => {
  return (
    <>
      <div className='m-8'>
        <BackButton />
      </div>
      <BookingComponent />
    </>
  );
};

export default Page;
