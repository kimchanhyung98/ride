import React, {Component} from 'react';
import { RenderAfterNavermapsLoaded, NaverMap, Marker } from "react-naver-maps";

class Map extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const NAVER_API_KEY = env.CLIENT_ID;

        return (
            <RenderAfterNavermapsLoaded
                ncpClientId={NAVER_API_KEY}
                error={<p>Maps Load Error</p>}
                loading={<p>Maps Loading...</p>}>
                <NaverMap
                    mapDivId={'map'} // default: react-naver-map
                    style={{
                      width: this.props.width,
                      height: this.props.height
                    }}
                    defaultCenter={{
                        lat: this.props.lat,
                        lng: this.props.lng
                    }}
                    center={{
                        lat: this.props.lat,
                        lng: this.props.lng
                    }}
                    zoom={ this.props.zoom }
                    onClick={(e) => {
                        this.props.handleSetMarker(e.coord.y, e.coord.x);
                    }}>

                    <Marker
                        position={{ lat: this.props.lat, lng: this.props.lng }} />
                </NaverMap>
            </RenderAfterNavermapsLoaded>
        );
    }
};

export default Map;
