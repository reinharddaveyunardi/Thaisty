import dayjs from "dayjs";

export const getMonthlyData = (rawData: any) => {
    const grouped = rawData.reduce(({acc, item}: any) => {
        const month = dayjs(item.date).format("MMM");
        acc[month] = (acc[month] || 0) + item.amount;
        return acc;
    }, {});

    const labels = Object.keys(grouped);
    const data = Object.values(grouped);

    return {labels, data};
};
