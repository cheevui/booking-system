import axios from "axios";
import { useContext, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { AuthContext } from "../AuthContext";


export default function NewProfileModal({ showNewProfile, handleHideNewProfile, fetchUserInfo, url }) {
    // const url = "https://40f8dbed-c644-40a5-9c00-00829d580286-00-k7wgrwzp6mb.pike.replit.dev";
    const { currentUser } = useContext(AuthContext);
    const [address, setAddress] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [file, setFile] = useState("");
    const [username, setUsername] = useState("");

    const style = "d-flex align-items-center ps-4";

    const updateNewProfile = async () => {
        try {
            let imageRef = null
            let imageUrl = null

            if (file) {
                imageRef = ref(storage, `users/${currentUser.uid}/${file.name}`);
                const response = await uploadBytes(imageRef, file);
                imageUrl = await getDownloadURL(response.ref);
            }
            const data = {
                username,
                dob,
                gender,
                address,
                profile_image: imageUrl
            };
            try {
                await axios.put(`${url}/newuser/${currentUser.uid}`, data)
                fetchUserInfo();
                handleHideNewProfile();
            } catch (apiError) {
                await deleteObject(imageRef);
                console.error("Failed to upload user's data, image deleted:", apiError);
            }
        } catch (storageError) {
            console.error("Failed to upload image:", storageError);
        }
    }

    return (
        <>
            <Modal
                show={showNewProfile}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header>
                    <h4>User Information</h4>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row} className="mb-2" controlId="username">
                            <Col xs="3" className={style}>
                                <Form.Label className="fw-bold">Username</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="text"
                                    required
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-2" controlId="dob">
                            <Col xs="3" className={style}>
                                <Form.Label className="fw-bold">Birth Date</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    type="date"
                                    required
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-2" controlId="gender">
                            <Col xs="3" className={style}>
                                <Form.Label className="fw-bold">Gender</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    as="select"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-2" controlId="address">
                            <Col xs="3" className="d-flex align-items-start pt-1 ps-4">
                                <Form.Label className="fw-bold">Address</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    as="textarea"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    rows={3}
                                    required
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-2" controlId="address">
                            <Col xs="3" className={style}>
                                <Form.Label className="text-center fw-bold">Profile Picture</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    className="mb-3"
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        className="rounded-pill"
                        onClick={updateNewProfile}
                    >
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}