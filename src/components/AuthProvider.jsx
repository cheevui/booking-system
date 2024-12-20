import { useCallback, useEffect, useState } from "react";
import { auth } from "../firebase";
import axios from "axios";
import { AuthContext } from "../AuthContext";


export function AuthProvider({ children }) {
    const url = "https://97d4f283-b212-4cd7-88bc-8d2e6dd4fe23-00-214v52zx1yx1w.pike.replit.dev"
    const [currentUser, setCurrentUser] = useState(null);
    const [userInfo, setUserInfo] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchUserInfo = useCallback(async () => {
        if (currentUser)
            try {
                const response = await axios.get(`${url}/user/${currentUser.uid}`);

                if (response.data) {
                    setUserInfo(response.data);
                }

                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
    }, [currentUser])

    useEffect(() => {
        return auth.onAuthStateChanged((user) => {
            fetchUserInfo();
            setCurrentUser(user);
            setLoading(false);
        });
    }, [fetchUserInfo]);

    useEffect(() => {
        if (currentUser) {
            fetchUserInfo();
        }
    }, [currentUser, fetchUserInfo])

    const value = { currentUser, userInfo, fetchUserInfo, setCurrentUser, setUserInfo };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )

}