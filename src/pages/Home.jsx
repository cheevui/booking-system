import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Modal, Row } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";



export default function Home() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const [uid, setUid] = useState("");
    const [show, setShow] = useState(false);
    const url = "https://97d4f283-b212-4cd7-88bc-8d2e6dd4fe23-00-214v52zx1yx1w.pike.replit.dev";
    const auth = getAuth();
    const { userInfo, currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser && userInfo) navigate("/dashboard")
    }, [currentUser, userInfo, navigate]);

    const handleShowSignUp = () => setShow(true);
    const handleCloseSignUp = () => setShow(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await createUserWithEmailAndPassword(
                auth,
                username,
                password
            );
            const uid = res.user.uid;

            try {
                await axios.post(`${url}/user`, { user_id: uid });
            } catch (apiError) {
                await res.user.delete();
                console.error("API request failed, Firebase user deleted:", apiError)
                alert("Registration failed. Please try again.");
            }
        } catch (authError) {
            console.error("Firebase authentication failed:", authError);
            alert("Registration failed. Please check your details and try again.");
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await signInWithEmailAndPassword(auth, username, password);
            console.log(res.user);
        } catch (err) {
            console.error(err);
            alert("Login failed. Please check your details and try again.");
        }
    };

    return (
        <Row className="d-flex flex-row align-items-center">
            <Col sm={6}>
                <Image src="src/assets/car-rental-logo.avif" fluid />
            </Col>
            <Col sm={6}>
                <h1>Freedom Car Rental Services</h1>
                <Container>
                    <Form className="my-5" onSubmit={handleLogin}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                onChange={(e) => setUsername(e.target.value)}
                                type="email"
                                placeholder="Enter email"
                                className="w-75"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Enter password"
                                className="w-75"
                            />
                        </Form.Group>
                        <Button className="rounded-pill" type="submit">
                            Login
                        </Button>
                    </Form>
                    <p>Non existing user? Create and join us now.</p>
                    <Button className="rounded-pill" onClick={handleShowSignUp}>
                        Sign Up
                    </Button>
                </Container>
            </Col>
            <Modal
                show={show === true}
                onHide={handleCloseSignUp}
                animation={false}
                centered
            >
                <Modal.Body>
                    <h2 className="mb-4" style={{ fontWeight: "bold" }}>
                        Create your account
                    </h2>
                    <Form
                        className="d-grid gap-2 px-5"
                        onSubmit={handleSignUp}
                    >
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                onChange={(e) => setUsername(e.target.value)}
                                type="email"
                                placeholder="Enter email"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                placeholder="Enter password"
                            />
                        </Form.Group>
                        <p style={{ fontSize: "12px" }}>
                            By signing up, you agree to the Terms of Service and Privacy Policy, including Cookies Use. Freedom Car Rental Services may use your contact information, including your email address and phone number for purposes outlined in our Privacy Policy, like keeping your account secure and personalising our services, including ads. Learn mmore. Others will be able to find you by email or phone number, when provided, unless you choose otherwise here.
                        </p>

                        <Button className="rounded-pill" type="submit">
                            Sign Up
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Row>
    )
}