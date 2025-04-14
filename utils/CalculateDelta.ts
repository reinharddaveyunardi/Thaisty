import React, {useState} from "react";

const toRadian = (deg: number) => deg * (Math.PI / 180);

const harversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = toRadian(lat2 - lat1);
    const dLon = toRadian(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

export const calculateDelta = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const distance = harversine(lat1, lon1, lat2, lon2);

    const latDelta = (lat2 - lat1) * (Math.PI / 180);
    const longDelta = (lon2 - lon1) * (Math.PI / 180) * Math.cos(toRadian(lat1));

    return {distance, latDelta, longDelta};
};
