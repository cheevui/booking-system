// import axios from "axios";
import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react"
import { Button, Card, Col, Container, Form, Modal, Row, Spinner } from "react-bootstrap"
import { AuthContext } from "../AuthContext";


function CarCard({ car, handleShow, noProductImage }) {
    const {
        vehicle_image: imageUrl,
        vehicle_brand: brand,
        vehicle_model: model,
        vehicle_year_made: yearMade,
        color: color,
        quantity_available: quantity,

    } = car;

    return (
        <Card className="me-2 mb-2" style={{ width: '13rem' }}>
            {imageUrl === null ? (
                <Card.Img variant="top" src={noProductImage} />
            ) : (
                <Card.Img variant="top" style={{ width: "183px", height: "183px", objectFit: "contain" }} src={imageUrl} />
            )}
            <Card.Body>
                <Card.Title>{brand} {model}</Card.Title>
                <Card.Text>
                    Year Made: {yearMade}
                </Card.Text>
                <Card.Text>
                    Color: {color}
                </Card.Text>
                <Card.Text>
                    Cars Availability: {quantity}
                </Card.Text>
                {quantity > 0 ? (
                    <Button
                        variant="primary"
                        onClick={() => handleShow(car)}
                    >
                        Booking
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        disabled
                        onClick={() => handleShow(car)}
                    >
                        Not Available
                    </Button>
                )}
            </Card.Body>
        </Card>
    )
}

export default function Carlist({ url, state }) {
    const { currentUser } = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentSelection, setCurrentSelection] = useState([]);
    const [carlist, setCarlist] = useState([]);
    const [loadingCarlist, setLoadingCarlist] = useState(false);

    const noProductImage = "src/assets/no_image.jpg";

    const handleShow = (car) => {
        setShow(true);
        selectedVehicle(car);
        console.log(currentSelection);
    }

    const handleClose = () => setShow(false);

    //Selected vehicles
    const selectedVehicle = (car) => {
        const id = car.vehicle_id;
        const vehicle = carlist.filter((car) => car.vehicle_id === id);
        setCurrentSelection(vehicle);
    }

    const fetchCarList = useCallback(async () => {
        try {
            setLoadingCarlist(true);
            const response = await axios.get(`${url}/vehicles`);
            setCarlist(response.data.rows);
            setLoadingCarlist(false);
        } catch (err) {
            console.error("Error fetching car list:", err);
        }
    }, [url]);

    // const url = "https://40f8dbed-c644-40a5-9c00-00829d580286-00-k7wgrwzp6mb.pike.replit.dev";
    // const [carlist, setCarlist] = useState([]);
    // const [loading, setLoading] = useState(true);

    // const fetchCarList = async () => {
    //     try {
    //         const response = await axios.get(`${url}/vehicles`);
    //         setCarlist(response.data.rows);
    //         console.log(response);
    //         setLoading(false);
    //     } catch (err) {
    //         console.error("Error fetching car list:", err);
    //     }
    // }

    useEffect(() => {
        if (state === "Booking") {
            fetchCarList();
        }
    }, [state, fetchCarList])

    const bookVehicle = async () => {
        try {
            const data = {
                user_id: currentUser.uid,
                vehicle_id: currentSelection[0].vehicle_id,
                booking_date: date,
                end_date: endDate,
            };
            await axios.post(`${url}/booking`, data);
            console.log("Booking Successful!");
            await fetchCarList();
            setDate("");
            handleClose();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            {loadingCarlist && (
                <Spinner animation="border" className="ms-3 mt-3" variant="primary" />
            )}
            <Container className="mt-2 ms-2">
                <Row>
                    {carlist.length > 0 && carlist
                        .sort((a, b) => {
                            const brandCompare = a.vehicle_brand.localeCompare(b.vehicle_brand);
                            if (brandCompare === 0) {
                                return a.vehicle_model.localeCompare(b.vehicle_model);
                            }
                            return brandCompare
                        }
                        )
                        .map((car) => (
                            <CarCard
                                key={car.vehicle_id}
                                car={car}
                                handleShow={handleShow}
                                noProductImage={noProductImage}
                            />
                        ))}
                </Row>
            </Container>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <Form>
                        {currentSelection[0] && (
                            <>
                                <h4>Confirm Booking Detail</h4>
                                <Form.Group as={Row} className="mb-2" controlId="date">
                                    <Col xs="2" className="d-flex align-items-center justify-content-center">
                                        <Form.Label className="fw-bold">Date</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
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
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
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
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        className="rounded-pill"
                        onClick={bookVehicle}
                    >
                        Booking
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}