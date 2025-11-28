import type {Venue} from "../types";

interface Props {
    venue: Venue;
}

const VenueCard: React.FC<Props> = ({ venue }) => (
    <div className="bg-[#1b2026] rounded-xl shadow-lg overflow-hidden hover:scale-105 transition">
        <img
            src={`https://source.unsplash.com/400x250/?restaurant,${venue.name}`}
            alt={venue.name}
            className="w-full h-48 object-cover"
        />
        <div className="p-4">
            <h3 className="text-lg font-semibold">{venue.name}</h3>
            <p className="text-gray-400 text-sm">
                📍 {venue.city}, {venue.address}
            </p>
            <p className="text-yellow-400 mt-1">⭐ {venue.rating}/5</p>
        </div>
    </div>
);

export default VenueCard;
