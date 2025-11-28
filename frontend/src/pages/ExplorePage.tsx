import { useEffect, useState } from "react";
import { getAllVenues } from "../api/venueApi";
import VenueCard from "../components/VenueCard";
import Header from "../components/Header";
import type {Venue} from "../types";

const ExplorePage = () => {
    const [venues, setVenues] = useState<Venue[]>([]);

    useEffect(() => {
        getAllVenues()
            .then((data) => setVenues(data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="bg-[#0f141a] min-h-screen text-white">
            <Header />
            <div className="p-8 grid grid-cols-3 gap-6">
                {venues.length > 0 ? (
                    venues.map((v) => <VenueCard key={v.id} venue={v} />)
                ) : (
                    <p>Yükleniyor...</p>
                )}
            </div>
        </div>
    );
};

export default ExplorePage;
