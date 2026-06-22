import { useMapEvents } from "react-leaflet";

type Props = {
    onclick : (lat: number, lng: number) => void;
}

const MapClickHandler = ({onclick} : Props) => {
    useMapEvents({
        click(e){
            const {lat, lng} = e.latlng;
            onclick(lat,lng);
        }
    });

    return null
}

export default MapClickHandler;