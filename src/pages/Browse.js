import env from "react-dotenv";
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import '../App.css';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { useEffect, useState } from "react";
import axios from 'axios';
import { Container } from 'react-bootstrap';

import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function Browse() {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [fullscreen, setFullscreen] = useState(true);

    const [letters] = useState(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"])
    const [chosenLetterCharacter, setChosenLetterCharacter] = useState(null);
    const [characterApiResponse, setCharacterApiResponse] = useState(null);
    const [totalCharacters, setTotalCharacters] = useState(null);
    const [apiCount, setApiCount] = useState(1);

    const [characterId, setCharacterId] = useState(null);
    const [characterName, setCharacterName] = useState(null)
    const [comicsList, setComicsList] = useState(null);

    const handleLetterClickCharacter = event => {
        console.log('Letter clicked');
        // 👇️ refers to the link element
        setChosenLetterCharacter(event.target.innerHTML);
    };

    const handleCharacterClickModal = event => {
        handleShow();
        console.log('Character clicked');
        // console.log(event.target.getAttribute("data-char-id"));

        setCharacterId(event.target.getAttribute("data-char-id"));
        setCharacterName(event.target.getAttribute("data-char-name"));

        axios.get(`https://gateway.marvel.com:443/v1/public/comics?format=comic&formatType=comic&noVariants=true&characters=${event.target.getAttribute("data-char-id")}&orderBy=onsaleDate&ts=1${env.API_URL}`)
            .then(function (response) {
                console.log(response.data.data.results)
                setComicsList(response.data.data.results);
            });

    }



    useEffect(() => {
        if (chosenLetterCharacter) {
            axios.get(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${chosenLetterCharacter}&orderBy=name&limit=100&ts=1${env.API_URL}`)
                .then(function (response) {
                    console.log(response.data.data.results);
                    setTotalCharacters(response.data.data.total - 100);
                    setCharacterApiResponse(response.data.data.results);
                    setApiCount(1);

                })
        }

    }, [chosenLetterCharacter]);

    useEffect(() => {
        if (characterApiResponse) {
            if (characterApiResponse.length > 99 && totalCharacters > 0) {
                console.log("needs pagination")
                let offset = 100 * apiCount;
                axios.get(`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${chosenLetterCharacter}&orderBy=name&limit=100&offset=${offset}&ts=1${env.API_URL}`)
                    .then(function (response2) {
                        console.log(response2.data.data.results)
                        let mergeArray3 = [...characterApiResponse, ...response2.data.data.results];
                        setCharacterApiResponse(mergeArray3);
                        setApiCount(apiCount + 1);
                        setTotalCharacters(totalCharacters - 100);
                    });
            }
        }
    }, [characterApiResponse]);


    return (
        <Tabs
            defaultActiveKey="home"
            id="uncontrolled-tab-example"
            className="mb-3"
            justify
        >
            <Tab eventKey="home" title="Characters">


                <Container fluid>
                    <div className="letterButton">
                        {letters.map((letter) => {
                            let char = letter;
                            return (
                                <Button onClick={handleLetterClickCharacter}>{char}</Button>
                            )
                        })}
                    </div>
                    <Row>

                        {characterApiResponse &&
                            characterApiResponse.map((result) => {
                                let name = result.name;
                                let comicCover = `${result.thumbnail.path}.${result.thumbnail.extension}`;
                                return (
                                    <>
                                        <Card style={{ width: '18rem' }} onClick={handleCharacterClickModal}>
                                            <Card.Img variant="top" 
                                            data-char-name={result.name} data-char-id={result.id} src={comicCover} />
                                            <Card.Body>
                                                <Card.Title>{name}</Card.Title>
                                                <Card.Text>
                                                    {/* Release Date: {comicReleaseDate} */}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </>

                                )

                            })}
                        <Modal show={show} fullscreen={fullscreen} onHide={handleClose} className="modalBackground">
                            <Modal.Header closeButton>
                                <Modal.Title>Comics "{characterName}" appears in:</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row>
                                    {comicsList && comicsList.map((result) => {
                                        let comicTitle = result.title;
                                        let comicCover = `${result.thumbnail.path}.${result.thumbnail.extension}`;
                                        return (
                                            <Card style={{ width: '18rem' }}>
                                                <Card.Img variant="top" data-char-id={result.id} src={comicCover} />
                                                <Card.Body>
                                                    <Card.Title>{comicTitle}</Card.Title>
                                                    <Card.Text>
                                                        {/* Release Date: {comicReleaseDate} */}
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        )

                                    })}
                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Row>
                </Container>




            </Tab>
            {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
            <Tab eventKey="profile" title="Events">

            </Tab>
            {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
            <Tab eventKey="contact" title="Series">

            </Tab>
            {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
        </Tabs>
    )

}

export default Browse;