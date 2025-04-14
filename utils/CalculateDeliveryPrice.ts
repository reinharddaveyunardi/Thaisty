const priceBase = 25;
const pricePerKm = 8;

export const CalculateDeliveryPrice = (distance: number) => {
    return priceBase + Math.ceil(distance) * pricePerKm;
};
