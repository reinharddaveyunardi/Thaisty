import {Timestamp} from "firebase/firestore";

export function formatTime(timestamp: Timestamp) {
    const date = timestamp.toDate(); // convert ke JS Date
    return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });
}
