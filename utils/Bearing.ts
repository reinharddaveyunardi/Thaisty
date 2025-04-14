export const getBearing = (startLat: number, startLng: number, endLat: number, endLng: number) => {
    const toRadian = (deg: number) => (deg * Math.PI) / 180;
    const toDegree = (radian: number) => (radian * 180) / Math.PI;

    const dLon = toRadian(endLng - startLng);
    const y = Math.sin(dLon) * Math.cos(toRadian(endLat));
    const x = Math.cos(toRadian(startLat)) * Math.sin(toRadian(endLat)) - Math.sin(toRadian(startLat)) * Math.cos(toRadian(endLat)) * Math.cos(dLon);
    const bearing = Math.atan2(y, x);
    return (toDegree(bearing) + 360) % 360;
};
