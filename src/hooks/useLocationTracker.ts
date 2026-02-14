import { useState, useEffect } from 'react';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useLocationTracker(userId: string | undefined, isOnline: boolean) {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId || !isOnline) return;

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        const updateLocation = async (position: GeolocationPosition) => {
            const { latitude: lat, longitude: lng } = position.coords;
            const newLocation = { lat, lng };
            setLocation(newLocation);

            try {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    location: newLocation,
                    lastActive: Timestamp.now(),
                    isActive: true
                });
            } catch (err) {
                console.error('Error updating location in Firestore:', err);
            }
        };

        const handleError = (err: GeolocationPositionError) => {
            console.error('Geolocation error:', err.message);
            setError(err.message);
        };

        // Initial update
        navigator.geolocation.getCurrentPosition(updateLocation, handleError);

        // Watch position
        const watchId = navigator.geolocation.watchPosition(updateLocation, handleError, {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, [userId, isOnline]);

    return { location, error };
}
