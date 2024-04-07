import { React, useState, useEffect } from 'react';

const NoInternetConnection = (props) =>
{
    const [isOnline, setOnline] = useState(true);
    useEffect(() =>
    {
        setOnline(navigator.onLine)
    }, [])
    window.addEventListener('online', () =>
    {
        setOnline(true)
    });

    window.addEventListener('offline', () =>
    {
        setOnline(false)
    });
    if (isOnline)
    {
        return (
            props.children
        )
    } else
    {
        return (
                    <div className='text-center'>
                        <h1 className=' text-white fx-5'>NoInternetConnection</h1>
                        <span className=' text-white'>Please Check Your Internet.</span>
                    </div>
        )
    }
}

export default NoInternetConnection;