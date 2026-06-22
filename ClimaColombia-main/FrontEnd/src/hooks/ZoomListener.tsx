import { useMap } from "react-leaflet";
import { useEffect } from "react";

export default function ZoomListener({ setZoom }: { setZoom: (z: number) => void }) {
  const map = useMap();

  useEffect(() => {
    const updateZoom = () => {
      setZoom(map.getZoom());
    };

    updateZoom(); // inicial
    map.on("zoomend", updateZoom);

    return () => {
      map.off("zoomend", updateZoom);
    };
  }, [map, setZoom]);

  return null;
}
