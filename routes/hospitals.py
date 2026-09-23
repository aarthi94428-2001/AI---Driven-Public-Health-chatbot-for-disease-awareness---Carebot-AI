from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
import requests
import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

router = APIRouter(prefix="/api/hospitals", tags=["hospitals"])

GOOGLE_MAPS_API_KEY = (os.environ.get("GOOGLE_MAPS_API_KEY") or "").strip()

class HospitalRequest(BaseModel):
    disease: Optional[str] = None
    location: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None


def _format_hospital(place: dict, disease: Optional[str] = None, city: Optional[str] = None) -> dict:
    loc = place.get("geometry", {}).get("location", {})
    phone = place.get("formatted_phone_number") or "Not available"
    hospital_name = place.get("name") or "Hospital"
    address = place.get("formatted_address") or place.get("vicinity") or "Address not available"
    return {
        "id": place.get("place_id") or hospital_name,
        "name": hospital_name,
        "address": address,
        "phone": phone,
        "specialization": disease or "General healthcare",
        "description": f"Healthcare facility serving {city or 'the local area'}.",
        "rating": place.get("rating", 0),
        "user_ratings_total": place.get("user_ratings_total", 0),
        "lat": loc.get("lat"),
        "lng": loc.get("lng"),
        "open_now": (place.get("opening_hours") or {}).get("open_now", False),
        "emergency": "emergency" in str(place.get("types", [])).lower()
    }


@router.get("/")
async def get_hospitals(
    lat: float = Query(None),
    lng: float = Query(None),
    city: Optional[str] = Query(None),
    disease: Optional[str] = Query(None),
    radius: int = Query(5000),
):
    if not city and (lat is None or lng is None):
        raise HTTPException(status_code=400, detail="Please provide a city or location to search hospitals.")

    if not GOOGLE_MAPS_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Google Maps API key is not configured. Add GOOGLE_MAPS_API_KEY to Backend/.env and restart the backend.",
        )

    query_parts = ["hospital"]
    if disease:
        query_parts.append(disease)
    if city:
        query_parts.append(city)
    query = " ".join(query_parts)
    location = f"{lat},{lng}" if lat is not None and lng is not None else None

    try:
        details = []
        params = {"query": query, "key": GOOGLE_MAPS_API_KEY}
        if location:
            params["location"] = location
            params["radius"] = radius

        response = requests.get(
            "https://maps.googleapis.com/maps/api/place/textsearch/json",
            params=params,
            timeout=15,
        )
        response.raise_for_status()
        results = response.json().get("results", [])

        for place in results[:10]:
            place_id = place.get("place_id")
            if not place_id:
                continue
            details_response = requests.get(
                "https://maps.googleapis.com/maps/api/place/details/json",
                params={
                    "place_id": place_id,
                    "fields": "name,formatted_address,formatted_phone_number,geometry,rating,user_ratings_total,opening_hours,types",
                    "key": GOOGLE_MAPS_API_KEY,
                },
                timeout=15,
            )
            details_response.raise_for_status()
            detail = details_response.json().get("result") or {}
            details.append(_format_hospital(detail, disease=disease, city=city or "the local area"))

        return details
    except requests.RequestException as exc:
        raise HTTPException(status_code=500, detail=f"Nearby hospital search failed: {str(exc)}")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Unexpected hospital search error: {str(exc)}")


@router.post("/search")
async def find_hospitals_legacy(request: HospitalRequest):
    if not request.location and (request.lat is None or request.lng is None):
        raise HTTPException(status_code=400, detail="Please provide a city or location to search hospitals.")

    if not GOOGLE_MAPS_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Google Maps API key is not configured. Add GOOGLE_MAPS_API_KEY to Backend/.env and restart the backend.",
        )

    query_parts = ["hospital"]
    if request.disease:
        query_parts.append(request.disease)
    if request.location:
        query_parts.append(request.location)
    query = " ".join(query_parts)
    location = f"{request.lat},{request.lng}" if request.lat is not None and request.lng is not None else None

    try:
        params = {"query": query, "key": GOOGLE_MAPS_API_KEY}
        if location:
            params["location"] = location
            params["radius"] = 5000

        response = requests.get(
            "https://maps.googleapis.com/maps/api/place/textsearch/json",
            params=params,
            timeout=15,
        )
        response.raise_for_status()
        places = response.json().get("results", [])
        hospitals = []
        for place in places[:10]:
            hospital = _format_hospital(place, disease=request.disease, city=request.location or "the local area")
            hospitals.append(hospital)
        return hospitals
    except requests.RequestException as exc:
        raise HTTPException(status_code=500, detail=f"Nearby hospital search failed: {str(exc)}")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Unexpected hospital search error: {str(exc)}")
