import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

interface DeliveryMapProps {
  position: [number, number];
  onPositionChange: (pos: [number, number]) => void;
  address: string;
  onAddressChange: (addr: string) => void;
}

const DeliveryMap = ({ position, onPositionChange, address, onAddressChange }: DeliveryMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(position, 14);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const icon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    const marker = L.marker(position, { icon }).addTo(map);
    markerRef.current = marker;

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onPositionChange([lat, lng]);
      reverseGeocode(lat, lng);
    });

    // Locate button
    const locateControl = L.Control.extend({
      onAdd: () => {
        const btn = L.DomUtil.create("button", "leaflet-bar");
        btn.innerHTML = "⊕";
        btn.style.cssText = "width:34px;height:34px;background:white;cursor:pointer;font-size:18px;border:none;display:flex;align-items:center;justify-content:center;";
        btn.onclick = (e) => {
          e.stopPropagation();
          e.preventDefault();
          map.locate({ setView: true, maxZoom: 16 });
        };
        return btn;
      },
    });
    new locateControl({ position: "topright" }).addTo(map);

    map.on("locationfound", (e: L.LocationEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onPositionChange([lat, lng]);
      reverseGeocode(lat, lng);
    });

    reverseGeocode(position[0], position[1]);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
      );
      const data = await res.json();
      if (data.display_name) {
        onAddressChange(data.display_name);
      }
    } catch {
      onAddressChange(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  };

  return (
    <div>
      <div ref={mapRef} className="h-64 w-full rounded-xl overflow-hidden border" />
      {address && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-muted p-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Tanlangan manzil:</p>
            <p className="text-sm font-medium">{address}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryMap;
