import { useContext, useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
// import { storage } from "../firebase";
// import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import axios from "axios";
import Carlist from "../components/Carlist";
import Bookinglist from "../components/Bookinglist";
import NewProfileModal from "../components/NewProfileModal";
import UserProfile from "../components/UserProfile";
import SideBar from "../components/SideBar";
import Welcome from "../components/Welcome";
import UpdateVehicles from "../components/UpdateVehicle";
import { AuthContext } from "../AuthContext";


export default function Dashboard() {
    const { userInfo, fetchUserInfo } = useContext(AuthContext);
    const [state, setState] = useState("Welcome")
    const url = "https://97d4f283-b212-4cd7-88bc-8d2e6dd4fe23-00-214v52zx1yx1w.pike.replit.dev";

    const [showNewProfile, setShowNewProfile] = useState(false);
    const handleShowNewProfile = () => setShowNewProfile(true);
    const handleHideNewProfile = () => setShowNewProfile(false);

    useEffect(() => {
        if (userInfo && userInfo.isnew === true) {
            handleShowNewProfile();
        }
    }, [userInfo])

    return (
        <>
            <NewProfileModal
                showNewProfile={showNewProfile}
                handleHideNewProfile={handleHideNewProfile}
                fetchUserInfo={fetchUserInfo}
                url={url}
            />
            {userInfo.length <= 0 ? (
                <Spinner animation="border" className="ms-3 mt-3" variant="primary" />
            ) : (
                <Row className="g-0">
                    <Col sm={2} className="d-flex flex-column justify-content-start align-items-center bg-light min-vh-100 pt-4">
                        <SideBar setState={setState} />
                    </Col>
                    {/* <Col
                    sm={2}
                    className="d-flex flex-column justify-content-start align-items-center bg-light vh-100 pt-4"
                >
                    <Row>
                        <Button
                            className="mb-4"
                            style={{ width: "9em" }}
                            onClick={() => setState("Welcome")}
                        >
                            Home
                        </Button>
                    </Row>
                    {userInfo.isadmin === true && (
                        <Button
                            className="mb-4"
                            style={{ width: "9em" }}
                            onClick={() => setState("Update Vehicle")}
                        >
                            Update Vehicle
                        </Button>
                    )}
                    <Button
                        className="mb-4"
                        style={{ width: "9em" }}
                        onClick={() => setState("Booking")}
                    >
                        Create Booking
                    </Button>
                    <Button
                        className="mb-4"
                        style={{ width: "9em" }}
                        onClick={() => setState("View")}
                    >
                        View Booking
                    </Button>
                </Col> */}

                    <Col sm={7}>
                        {state === "Welcome" && (
                            <Welcome />
                        )}
                        {state === "Update Vehicle" && (
                            <UpdateVehicles url={url} />

                        )}
                        {state === "Booking" && (
                            <>
                                <Carlist
                                    state={state}
                                    url={url}
                                />
                            </>
                        )}
                        {state === "View" && (
                            <>
                                <Bookinglist
                                    state={state}
                                    url={url}
                                />
                            </>
                        )}
                    </Col>
                    <Col sm={3} className="bg-light min-vh-100">
                        <UserProfile
                            url={url}
                        />
                    </Col>
                </Row>
            )}
        </>
    )
}