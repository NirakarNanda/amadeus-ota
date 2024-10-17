'use client';
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useDispatch } from '../../Redux/store';
import { getUser } from '../../Redux/slices/auth.slice';

const CheckAuthentication = ({ children, setLoading }: { children: React.ReactNode; setLoading: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const token = Cookies.get('accessToken');

    useEffect(() => {
        const retriveUser = async () => {
            try {
                if (!token) {
                    router.push('/login');
                } else {
                    await dispatch(getUser());
                }
            } catch (error) {
                console.log('error while retrieving user', error);
            } finally {
                setLoading(false);
            }
        };
    
        retriveUser();
    }, []); // Empty dependency array ensures this runs only once after component mount
    

    return <>{children}</>;
};

export default CheckAuthentication;
