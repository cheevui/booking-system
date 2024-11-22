import { useContext } from "react";
import { Button, Row } from "react-bootstrap";
import { AuthContext } from "../AuthContext";


export default function SideBar({ setState }) {
    const { userInfo } = useContext(AuthContext);


    return (
        <>
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
        </>
    )
}