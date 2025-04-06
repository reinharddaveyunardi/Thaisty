export function BahtFormat(price: number) {
    return new Intl.NumberFormat("th-TH", {style: "currency", currency: "THB", trailingZeroDisplay: "stripIfInteger"}).format(price);
}
