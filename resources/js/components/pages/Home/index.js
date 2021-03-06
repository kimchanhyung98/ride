import React, {memo, useCallback, useEffect, useState} from "react";
import PageTemplate from "@components/templates/PageTemplate";
import RideLinkedList from "@components/UI/organisms/RideLinkedList";
import {getList} from "@/api/rideListApi";
import {scrollPaging} from "@/utils/scroll";

const Home = memo(() => {
    const [rides, setRides] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const getData = useCallback(async () => {
        setIsLoading(true);
        try {
            const options = {
                params: {
                    page: page
                }
            };
            const response = await getList(options);

            if (response.success) {
                const {data} = response;
                const newData = rides.concat(data);

                setRides(newData);

                if (data.length < 10) {
                    setPage(0);
                }
            } else {
                throw response;
            }
        } catch (err) {
            const {message} = err.data;
            alert(message);
        } finally {
            setIsLoading(false);
        }
    }, [page, rides]);

    useEffect(() => {
        if (page) {
            getData();
        }
    }, [page]);

    useEffect(() => {
        function handleScroll() {
            scrollPaging(isLoading, () => {
                setPage(page + 1);
            });
        }

        if (page) {
            window.addEventListener('scroll', handleScroll);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [page, isLoading]);

    return (
        <PageTemplate>
            <section>
                <RideLinkedList rides={rides} />
            </section>
        </PageTemplate>
    );
});

export default Home;
