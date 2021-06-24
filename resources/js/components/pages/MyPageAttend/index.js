import React, {memo, useCallback, useEffect, useState} from "react";
import RideButtonList from "@components/UI/organisms/RideButtonList";
import {getAttendRides, rideAttendCancel} from "@/api/rideAttendApi";

const MyPageAttend = memo(() => {
    const [rides, setRides] = useState([]);
    const [page, setPage] = useState(0);
    const [isEnd, setIsEnd] = useState(false);
    const [isLoading] = useState(false);

    const handleScroll = useCallback((event) => {
        if (isEnd) {
            const scrollPosition = event.srcElement.scrollingElement.scrollTop + window.innerHeight;

            if (scrollPosition >= document.body.offsetHeight) {
                getData();
            }
        }
    }, [isEnd]);

    const handleRideCancel = useCallback(async (id) => {
        if (isLoading) return false;
        setIsEnd(true);

        try {
            const options = {
                data: {
                    ride_id: id
                }
            };
            const response = await rideAttendCancel(options);

            if (response.success) {
                const newData = [...rides].filter(ride => {
                    return ride.id !== id;
                });
                const {message} = response.data;
                setRides(newData);
                alert(message);
            } else {
                throw response;
            }
        } catch (err) {
            alert('오류');
        }
    }, [isLoading, rides]);

    const getData = useCallback(async () => {
        setPage(prevPage => prevPage + 1);
        setIsEnd(false);

        try {
            const options = {
                params: {
                    page: page
                }
            };
            const response = await getAttendRides(options);

            if (response.success) {
                const data = response.data;
                const newData = rides.concat(data);

                if (data.length < 10) {
                    window.removeEventListener('scroll', handleScroll);
                }

                setRides(newData);
                setIsEnd(true);
            } else {
                throw response;
            }
        } catch (err) {
            alert('오류');
            setIsEnd(true);
        }
    }, [page, rides]);

    useEffect(() => {
        getData();
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <RideButtonList type="attend"
                        rides={rides}
                        rideCancel={handleRideCancel}
                        emptyMessage="신청내역이 없습니다."/>
    );
});

export default MyPageAttend;