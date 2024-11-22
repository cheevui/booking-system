import { useContext, useState } from "react";
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import axios from "axios";
import { AuthContext } from "../AuthContext";


export default function UserProfile({ url }) {
    const { currentUser, userInfo, fetchUserInfo } = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const [address, setAddress] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [file, setFile] = useState(null);
    const [username, setUsername] = useState("");
    const profileImage = "src/assets/profile_image.jpg";
    const style = "d-flex items-align center"
    const textStyle = "text-start ms-5 fw-bold"

    const handleModalShow = () => {
        setUsername(userInfo.username);
        setDob(userInfo.dob);
        setGender(userInfo.gender);
        setAddress(userInfo.address);
        setFile(null);
        setShow(true)
    };

    const handleModalClose = () => setShow(false);

    const editProfile = async () => {
        try {
            let imageRef = null;
            let imageUrl = null;

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
                await axios.put(`${url}/user/${currentUser.uid}`, data)
                await fetchUserInfo();
                console.log(userInfo)
                handleModalClose();
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
            <Row className="g-0 d-flex flex-row justify-content-center mt-5">
                <Image
                    className={style}
                    src={userInfo.profile_image === null ? profileImage : userInfo.profile_image}
                    fluid
                    roundedCircle
                    style={{ width: "13em", height: "13em" }}
                />
            </Row>
            <Col className="mt-5 me-3">
                <Row>
                    <Col sm={4}>
                        <p className={textStyle}>Username</p>
                        <p className={textStyle}>D.O.B</p>
                        <p className={textStyle}>Gender</p>
                        <p className={textStyle}>Address</p>
                    </Col>
                    <Col sm={1}>
                        <p>:</p>
                        <p>:</p>
                        <p>:</p>
                        <p>:</p>
                    </Col>
                    <Col sm={7}>
                        <p>{userInfo.username}</p>
                        <p>{userInfo.dob}</p>
                        <p>{userInfo.gender}</p>
                        <p style={{
                            overflowWrap: "break-word",
                        }}>{userInfo.address}</p>
                    </Col>
                </Row>
                <Col className="d-flex flex-colum justify-content-center mt-3">
                    <Button onClick={handleModalShow}>Edit Profile</Button>
                </Col>
            </Col>

            <Modal
                show={show}
                onHide={handleModalClose}
                size="lg"
            >
                <Modal.Header closeButton>
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
                        onClick={editProfile}
                    >
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}