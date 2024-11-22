import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { storage } from "../firebase";
import axios from "axios";


export default function UpdateVehicles({ url }) {
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [made, setMade] = useState("");
    const [color, setColor] = useState("");
    const [file, setFile] = useState(null);

    const updateCarList = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = null;
            let imageRef = null;

            if (file) {
                imageRef = ref(storage, `vehicles/${file.name}`);
                const response = await uploadBytes(imageRef, file);
                imageUrl = await getDownloadURL(response.ref);
            }
            const data = {
                brand: brand,
                model: model,
                year_made: Number(made),
                color: color,
                image_url: imageUrl
            };

            try {
                axios.post(`${url}/vehicles`, data)
                console.log("Vehicle data added successfully, ", data);
                setBrand("");
                setModel("");
                setMade("");
                setColor("");
                setFile(null);
                alert("Vehicle added successfully")

            } catch (apiError) {
                await deleteObject(imageRef);
                console.error("Failed to add vehicle data, image deleted:", apiError);
            }
        } catch (storageError) {
            console.error("Failed to upload image:", storageError);
        }
    }

    return (
        <>
            <h2 className="mt-2 ms-3">Update New Vehicles</h2>
            <Container>
                <Form className="my-4" onSubmit={updateCarList}>
                    <Form.Group className="mb-3" controlId="carBrand">
                        <Form.Control
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            type="text"
                            placeholder="Enter Brand"
                            className="w-75"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="carModel">
                        <Form.Control
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            type="text"
                            placeholder="Enter Model"
                            className="w-75"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="carYearMade">
                        <Form.Control
                            value={made}
                            onChange={(e) => setMade(e.target.value)}
                            type="text"
                            placeholder="Enter Year Made"
                            className="w-75"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="carColor">
                        <Form.Control
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            type="text"
                            placeholder="Enter Color"
                            className="w-75"
                        />
                    </Form.Group>

                    <Form.Control
                        className="mb-3 w-75"
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button className="rounded-pill" type="submit">
                        Update
                    </Button>
                </Form>
            </Container>
        </>
    )
}