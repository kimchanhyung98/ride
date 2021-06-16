import React, {useEffect} from "react";
import {Route, useHistory} from 'react-router-dom';
import storage from "@/utils/storage";

const AuthRoute = ({check = null, ...props}) => {
    const history = useHistory();

    const authCheck = async () => {
        if (check === null) return;

        try {
            const loggedInfo = storage.get('loggedInfo');

            if ((check && !loggedInfo) || (!check && loggedInfo)) {
                throw {
                    check
                };
            }
        } catch (err) {
            if (err.check) {
                alert('로그인후 가능');
                history.push('/login');
            } else {
                history.push('/');
            }
        }
    };

    useEffect(() => {
        authCheck();
    }, []);

    return <Route {...props} />;
};

export default AuthRoute;
