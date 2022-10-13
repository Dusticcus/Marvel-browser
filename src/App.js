import env from "react-dotenv";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';

import TopNav from "./components/Navbar";

import './App.css';

import { useEffect, useState } from "react";
import axios from 'axios';
import { Container } from 'react-bootstrap';


function App() {

  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    axios.get(`https://gateway.marvel.com/v1/public/comics?format=comic&formatType=comic&noVariants=false&dateDescriptor=thisMonth&orderBy=onsaleDate&limit=100&ts=1${env.API_URL}`)
      .then(function (response) {
        console.log(response.data.data.results)
        setApiResponse(response.data.data.results);
      });
  }, []);

  return (
    <div className="App">
    
      <header className="App-header">
        <Container fluid>
          <Row>

            {apiResponse &&
              apiResponse.map((result) => {
                let comicTitle = result.title;
                {/* let comicCover = `${result.thumbnail.path}.${result.thumbnail.extension}`; */}
                let comicCover = `${result.images[0].path}.${result.images[0].extension}`;
                let comicReleaseDate = result.dates[0].date;
                comicReleaseDate = comicReleaseDate.split('T')[0];
                return (
                  <Card style={{ width: '18rem' }} key={result.id}>
                    <Card.Img variant="top" src={comicCover} />
                    <Card.Body>
                      <Card.Title>{comicTitle}</Card.Title>
                      <Card.Text>
                        Release Date: {comicReleaseDate}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                )

              })
            }
          </Row>
        </Container>
      </header>
    </div>
  );
}

export default App;
