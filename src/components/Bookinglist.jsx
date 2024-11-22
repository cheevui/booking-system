import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Col, Form, Image, Modal, Row, Spinner } from "react-bootstrap";
import { AuthContext } from "../AuthContext";


export default function Bookinglist({ state, url }) {
    const { currentUser, userInfo } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [updatedDate, setUpdatedDate] = useState("");
    const [updatedEndDate, setUpdatedEndDate] = useState("");
    const [loadingBookinglist, setLoadingBookinglist] = useState(false);
    const [bookingList, setBookingList] = useState([]);
    const [currentSelection, setCurrentSelection] = useState([]);
    const noProductImage = "src/assets/no_image.jpg";

    const handleShowModal = (booking) => {
        setShowModal(true);
        selectedBooking(booking);
        console.log(booking);
    }

    const handleCloseModal = () => setShowModal(false);

    const selectedBooking = (booking) => {
        const bookingId = booking.booking_id;
        const vehicle = bookingList.filter((selected) => selected.booking_id === bookingId);
        setCurrentSelection(vehicle);
        console.log(bookingId);
    }

    const fetchBookingList = useCallback(async () => {
        try {
            if (userInfo.isadmin === true) {
                setLoadingBookinglist(true);
                const response = await axios.get(`${url}/bookings`);
                setBookingList(response.data.rows);
                setLoadingBookinglist(false);
            } else {
                setLoadingBookinglist(true);
                const response = await axios.get(`${url}/bookings/user/${currentUser.uid}`);
                setBookingList(response.data.rows);
                setLoadingBookinglist(false);
            }
        } catch (err) {
            console.error("Error fetching booking list:", err);
        }
    }, [userInfo.isadmin, currentUser, url]);

    const editBooking = async (booking) => {
        try {
            const updatedData = {
                booking_date: updatedDate,
                end_date: updatedEndDate,
            }
            await axios.put(`${url}/bookings/${currentUser.uid}/${booking.booking_id}`, updatedData);
            setUpdatedDate("");
            setUpdatedEndDate("");
            handleCloseModal();
            fetchBookingList();
        } catch (error) {
            console.error(error)
        }
    }

    const cancelBooking = async (booking) => {
        try {
            await axios.put(`${url}/cancelBookings/${currentUser.uid}/${booking.booking_id}`);
            fetchBookingList();
        } catch (error) {
            console.error(error)
        }
    }

    const deleteBooking = async (booking) => {
        try {
            await axios.delete(`${url}/bookings/${booking.booking_id}`, { data: { user_id: currentUser.uid } })
            fetchBookingList();
            console.log(booking.booking_id);
            console.log("Booking Deleted");

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (state === "View") {
            fetchBookingList();

        }
    }, [state, fetchBookingList])

    return (
        <>
            {loadingBookinglist && (
                <Spinner animation="border" className="ms-3 mt-3" variant="primary" />
            )}
            {bookingList.length > 0 && (
                <Col
                >
                    {bookingList.length > 0 && bookingList.map((booking) => {
                        const {
                            booking_id: id,
                            booking_date: rawBookingDate,
                            end_date: rawEndDate,
                            vehicle_image: imageUrl,
                            vehicle_brand: brand,
                            vehicle_model: model,
                            // vehicle_year_made: yearMade,
                            color: color,
                            is_cancelled: isCancelled,
                            cancelled_time: rawCancelledTime,
                            username: username,
                        } = booking;

                        const bookingDate = new Date(rawBookingDate);
                        const year = bookingDate.getFullYear();
                        const month = String(bookingDate.getMonth() + 1).padStart(2, '0');
                        const day = String(bookingDate.getDate()).padStart(2, '0');

                        const endDate = new Date(rawEndDate);
                        const endYear = endDate.getFullYear();
                        const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
                        const endDay = String(endDate.getDate()).padStart(2, '0');

                        const cancelledDate = new Date(rawCancelledTime);
                        const cancelledYear = cancelledDate.getFullYear();
                        const cancelledMonth = String(cancelledDate.getMonth() + 1).padStart(2, '0');
                        const cancelledDay = String(cancelledDate.getDate()).padStart(2, '0');

                        return (
                            <div key={id}>
                                <Row
                                    className="g-0 my-3 pb-2"
                                    style={{
                                        borderBottom: "1px solid #D3D3D3",

                                    }}
                                >
                                    <Col sm={4} className="d-flex justify-content-center"
                                    >
                                        <Image
                                            src={imageUrl === null ? noProductImage : imageUrl}
                                            fluid

                                            style={{ width: "10em", height: "10em", objectFit: "contain" }}
                                        />
                                    </Col>
                                    <Col sm={2}>
                                        <Row>
                                            <Col>
                                                <p className="fw-bold">Start Date</p>
                                                <p className="fw-bold">End Date</p>
                                                <p className="fw-bold">Model</p>
                                                <p className="fw-bold">Variant</p>
                                                {userInfo.isadmin === true && <p className="fw-bold">Username</p>}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col sm={1}>
                                        <Row>
                                            <Col>
                                                <p>:</p>
                                                <p>:</p>
                                                <p>:</p>
                                                <p>:</p>
                                                {userInfo.isadmin === true && <p>:</p>}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <p>{year}-{month}-{day}</p>
                                                <p>{endYear}-{endMonth}-{endDay}</p>
                                                <p>{brand} {model}</p>
                                                <p>{color}</p>
                                                {userInfo.isadmin === true && <p>{username}</p>}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Row>
                                        <Col className="d-flex justify-content-end align-items-center">
                                            {isCancelled ? (
                                                <>
                                                    <p className="fst-italic mb-0 me-2 text-danger">Cancelled at: {cancelledYear}-{cancelledMonth}-{cancelledDay}</p>
                                                    <Button variant="primary" onClick={() => handleShowModal(booking)} disabled>Edit</Button>
                                                    <Button className="ms-1" variant="primary" onClick={() => cancelBooking(booking)} disabled>Cancel</Button>
                                                    <Button className="ms-1" variant="danger" onClick={() => deleteBooking(booking)} disabled>Delete</Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button variant="primary" onClick={() => handleShowModal(booking)}>Edit</Button>
                                                    <Button className="ms-1" variant="primary" onClick={() => cancelBooking(booking)}>Cancel</Button>
                                                    <Button className="ms-1" variant="danger" onClick={() => deleteBooking(booking)}>Delete</Button>
                                                </>
                                            )}
                                        </Col>
                                    </Row>
                                </Row>
                            </div>
                        )
                    })}
                </Col>
            )}
            {currentSelection[0] && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body>
                        <Form>
                            <>
                                <h4>Edit Booking Detail</h4>
                                <Form.Group as={Row} className="mb-2" controlId="date">
                                    <Col xs="2" className="d-flex align-items-center justify-content-center">
                                        <Form.Label className="fw-bold">Date</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            value={updatedDate}
                                            onChange={(e) => setUpdatedDate(e.target.value)}
                                            type="date"
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-2" controlId="endDate">
                                    <Col xs="2" className="d-flex align-items-center justify-content-center">
                                        <Form.Label className="fw-bold">Till</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            value={updatedEndDate}
                                            onChange={(e) => setUpdatedEndDate(e.target.value)}
                                            type="date"
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group className="mb-2" controlId="brand">
                                    <Form.Control
                                        value={currentSelection[0].vehicle_brand}
                                        disabled
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2" controlId="model">
                                    <Form.Control
                                        value={currentSelection[0].vehicle_model}
                                        disabled
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2" controlId="yearMade">
                                    <Form.Control
                                        value={currentSelection[0].vehicle_year_made}
                                        disabled
                                    />
                                </Form.Group>
                                <Form.Group className="mb-2" controlId="color">
                                    <Form.Control
                                        value={currentSelection[0].color}
                                        disabled
                                    />
                                </Form.Group>
                            </>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="primary"
                            className="rounded-pill"
                            onClick={() => editBooking(currentSelection[0])}
                        >
                            Booking
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    )
}