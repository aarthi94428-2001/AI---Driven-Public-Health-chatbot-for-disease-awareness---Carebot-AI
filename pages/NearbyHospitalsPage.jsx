import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import MapComponent from '../components/MapComponent';

const NearbyHospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const [searchParams, setSearchParams] = useState({
    disease: '',
    city: '',
    sortBy: 'distance'
  });

  // Detect user location
  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        setError(
          'Location access denied. Please allow location permission.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Calculate distance between two locations
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Search hospitals using OpenStreetMap Overpass API
  const fetchHospitals = async () => {
    if (!userLocation) {
      setError(
        'Please allow location access before searching for nearby hospitals.'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const radius = 10000;

      const query = `
        [out:json][timeout:25];

        (
          node["amenity"="hospital"]
            (around:${radius},${userLocation.lat},${userLocation.lng});

          way["amenity"="hospital"]
            (around:${radius},${userLocation.lat},${userLocation.lng});

          relation["amenity"="hospital"]
            (around:${radius},${userLocation.lat},${userLocation.lng});
        );

        out center;
      `;

      const response = await fetch(
        'https://overpass-api.de/api/interpreter',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `data=${encodeURIComponent(query)}`
        }
      );

      if (!response.ok) {
        throw new Error('Hospital service is currently unavailable.');
      }

      const data = await response.json();

      const hospitalList = data.elements
        .map((element) => {
          const lat =
            element.lat ||
            element.center?.lat;

          const lng =
            element.lon ||
            element.center?.lon;

          const tags = element.tags || {};

          if (!lat || !lng) {
            return null;
          }

          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            lat,
            lng
          );

          return {
            id: element.id,
            name:
              tags.name ||
              tags['name:en'] ||
              'Hospital',

            lat,
            lng,

            address:
              tags['addr:full'] ||
              [
                tags['addr:housenumber'],
                tags['addr:street'],
                tags['addr:city']
              ]
                .filter(Boolean)
                .join(', ') ||
              'Address not available',

            phone:
              tags.phone ||
              tags['contact:phone'] ||
              null,

            specialization:
              tags.healthcare ||
              tags['healthcare:speciality'] ||
              'Healthcare',

            emergency:
              tags.emergency === 'yes',

            website:
              tags.website ||
              null,

            rating: null,

            user_ratings_total: 0,

            distance
          };
        })
        .filter(Boolean);

      // Remove duplicate hospitals
      const uniqueHospitals = hospitalList.filter(
        (hospital, index, self) =>
          index ===
          self.findIndex(
            (h) =>
              h.lat === hospital.lat &&
              h.lng === hospital.lng
          )
      );

      if (uniqueHospitals.length === 0) {
        setError(
          'No hospitals found within 10 km. Try again or move to a different location.'
        );
        setHospitals([]);
      } else {
        setHospitals(uniqueHospitals);
      }
    } catch (err) {
      console.error(err);

      setError(
        'Unable to find nearby hospitals. Please try again.'
      );

      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  // Sort hospitals
  const sortedHospitals = useMemo(() => {
    const list = [...hospitals];

    if (searchParams.sortBy === 'rating') {
      return list.sort(
        (a, b) => (b.rating || 0) - (a.rating || 0)
      );
    }

    return list.sort(
      (a, b) => (a.distance || 999) - (b.distance || 999)
    );
  }, [hospitals, searchParams.sortBy]);

  return (
    <div className="flex h-screen bg-[#020617] text-white p-6 gap-6 overflow-hidden font-sans">

      <Sidebar />

      <main className="flex-1 flex bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">

        {/* LEFT SIDE */}
        <div className="w-1/2 flex flex-col h-full border-r border-white/5">

          <div className="p-10 border-b border-white/5">

            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-care-blue to-care-purple mb-8">
              Nearby Hospitals
            </h1>

            <div className="space-y-4">

              <div className="flex gap-4">

                <input
                  type="text"
                  placeholder="Disease (e.g. Fever)"
                  value={searchParams.disease}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      disease: e.target.value
                    })
                  }
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-care-blue/40 transition-all"
                />

                <input
                  type="text"
                  placeholder="City"
                  value={searchParams.city}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      city: e.target.value
                    })
                  }
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-care-blue/40 transition-all"
                />

              </div>

              <div className="flex gap-4 items-center">

                <select
                  value={searchParams.sortBy}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      sortBy: e.target.value
                    })
                  }
                  className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none"
                >
                  <option value="distance">
                    Sort by Distance
                  </option>

                  <option value="rating">
                    Sort by Rating
                  </option>
                </select>

                <button
                  onClick={fetchHospitals}
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-care-blue to-care-purple rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-care-blue/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {loading
                    ? 'Searching...'
                    : 'Find Nearby Hospitals'}
                </button>

              </div>

            </div>
          </div>

          {/* HOSPITAL LIST */}
          <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">

            <AnimatePresence mode="wait">

              {loading ? (

                <div className="flex flex-col items-center justify-center py-20 gap-4">

                  <div className="w-12 h-12 border-4 border-care-blue/10 border-t-care-blue rounded-full animate-spin"></div>

                  <p className="text-[10px] font-black text-care-gray uppercase tracking-widest">
                    Finding Nearby Hospitals...
                  </p>

                </div>

              ) : error ? (

                <div className="text-center py-20 text-red-400 font-bold">
                  {error}
                </div>

              ) : sortedHospitals.length === 0 ? (

                <div className="text-center py-20 text-white/40">
                  Allow your location and click
                  <br />
                  <strong>
                    Find Nearby Hospitals
                  </strong>
                </div>

              ) : (

                <div className="space-y-6">

                  {sortedHospitals.map((h, i) => (

                    <motion.div
                      key={h.id || `${h.name}-${i}`}
                      initial={{
                        opacity: 0,
                        y: 20
                      }}
                      animate={{
                        opacity: 1,
                        y: 0
                      }}
                      transition={{
                        delay: i * 0.05
                      }}
                      className="p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all"
                    >

                      <div className="flex gap-6">

                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-care-blue/20 text-care-blue">
                          🏥
                        </div>

                        <div className="flex-1">

                          <h3 className="text-xl font-black text-white mb-2">
                            {h.name}
                          </h3>

                          <div className="flex items-center gap-2 mb-3">

                            <span className="text-care-blue font-black text-xs">
                              📏 {h.distance?.toFixed(2)} km
                            </span>

                          </div>

                          <p className="text-xs text-care-gray mb-2 font-bold uppercase tracking-widest">
                            {h.specialization}
                          </p>

                          <p className="text-sm text-white/60 mb-2 leading-relaxed">
                            📍 {h.address}
                          </p>

                          {h.phone && (
                            <p className="text-sm text-white/60 mb-4">
                              📞 {h.phone}
                            </p>
                          )}

                          <div className="flex gap-3">

                            {h.phone && (
                              <button
                                onClick={() =>
                                  (window.location.href = `tel:${h.phone}`)
                                }
                                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                              >
                                📞 Call Now
                              </button>
                            )}

                            <button
                              onClick={() =>
                                window.open(
                                  `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`,
                                  '_blank'
                                )
                              }
                              className="flex-1 py-3 rounded-xl bg-care-blue/10 border border-care-blue/20 text-[10px] font-black uppercase tracking-widest text-care-blue hover:bg-care-blue/20 transition-all"
                            >
                              📍 Directions
                            </button>

                          </div>

                        </div>

                      </div>

                    </motion.div>

                  ))}

                </div>

              )}

            </AnimatePresence>

          </div>

        </div>

        {/* RIGHT SIDE MAP */}
        <div className="w-1/2 h-full relative">

          <MapComponent
            hospitals={sortedHospitals}
            center={
              userLocation || {
                lat: 20.5937,
                lng: 78.9629
              }
            }
          />

          <div className="absolute inset-0 pointer-events-none border-[20px] border-[#020617] rounded-[3rem] opacity-50 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]"></div>

        </div>

      </main>

    </div>
  );
};

export default NearbyHospitalsPage;
