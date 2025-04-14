import {useDriverLocation} from "@/contexts/DriverLocationProvider";

export const EstimatedTimeArrival = (distance: number, averageSpeed: number) => {
    if (!distance || !averageSpeed) return "Menghitung estimasi...";
    let ETAHours = distance / averageSpeed;
    if (!ETAHours || ETAHours === Infinity || isNaN(ETAHours)) {
        return "Menghitung estimasi...";
    } else {
        const hours = Math.floor(ETAHours);
        const minutes = Math.round((ETAHours - hours) * 60);

        if (hours === 0) {
            return `${minutes > 0 ? `${minutes} minutes` : "Less than a minute"}`;
        } else {
            return `${hours} hours ${minutes} minutes`;
        }
    }
};
