function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to FoodTrend Guide 🍽️</h1>
      <p className="text-gray-300 mb-6">Discover top-rated venues and share your favorites.</p>
      <a
        href="/home"
        className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
      >
        Explore Venues
      </a>
    </div>
  );
}

export default LandingPage;
