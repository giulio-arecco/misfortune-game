import { Row, Col, Button, Container, Form } from 'react-bootstrap';
import { Card, Game, User, Round } from '../models.mjs';
import { useState, useEffect } from 'react';
import CardsDisplay from './CardsDisplay.jsx';
import GameCard from './GameCard';
import API from '../API.mjs';

function GamePage(props) {
    const [currentRound, setCurrentRound] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [errors, setErrors] = useState(0);
    
    // Round 1 Starts
    // useEffect(() => {
    //     const fetchFirstRound = async () => {
    //         try {
    //             const roundCards = await API.getRandomCardsForGame(props.game.id, 1, false);
    //             if (roundCards.length === 0) {
    //                 console.error("No cards received");
    //                 return;
    //             }
                
    //             const newRound = await API.createRound(new Round(props.game.id, roundCards));
    //             setCurrentRound(newRound);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };

    //     fetchFirstRound();
    // }, []);

    const handlePositionChange = (pos) => setSelectedPosition(pos);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Carta inserita in posizione ${selectedPosition}`);
    };

    const handleStartGame = async () => {
        try {
            const roundCard = await API.getRandomCardsForGame(props.game.id, 1, false);
            const newRound = await API.createRound(new Round(props.game.id, [roundCard]));
            setCurrentRound(newRound);
            props.setGame((oldGame) => {
                const newGame = {
                    ...oldGame,
                    cards: oldGame.cards.push(roundCard).sort((a, b) => a.misfortune - b.misfortune),
                }
                return newGame;
            });
        } 
        catch (error) {
        console.error(error);
        }
    }

    return (
        currentRound === null ?
        <StartGameLayout
            game={props.game}
            handleStartGame={handleStartGame}
        />
        :
        <InGameLayout
            game={props.game}
            currentRound={currentRound}
            selectedPosition={selectedPosition}
            handlePositionChange={handlePositionChange}
            handleSubmit={handleSubmit}
        />        
    );
}

function StartGameLayout(props) {
    return (
        <Container fluid className="d-flex flex-column p-3 mt-4">
              <Container fluid className="text-center mb-4">
                <h2>Benvenuto al Gioco della Sfortuna!</h2>
                <p className="lead">
                  Queste sono le tue carte iniziali, ordinate per livello di sfortuna.
                  <br />Dovrai inserire le nuove carte al posto giusto per mantenere l'ordine crescente.
                </p>
              </Container>
              
              <CardsDisplay cards={props.game.cards} />
              
              <Container className="text-center mt-5">
                <Button variant="primary" size="lg" onClick={props.handleStartGame} className="px-5 py-3 fs-3"> Gioca </Button>
              </Container>
        </Container>
    );
}

function InGameLayout(props) {
    return (
        <Container fluid className="d-flex flex-column p-0" style={{ height: 'calc(90vh - 112px)', minHeight: 0, overflow: 'hidden' }}> 
            <Container fluid className="d-flex flex-column justify-content-around align-items-stretch h-100">
                <RoundCardAndInfo roundCard={props.currentRound.cards[0]} currRoundNumber={props.currentRound.number} errors={props.game.errors}/>
                <CardsForm 
                    cards={props.game.cards} 
                    selectedPosition={props.selectedPosition} 
                    onPositionChange={props.handlePositionChange}
                    onSubmit={props.handleSubmit}
                />
            </Container>
        </Container>
    );
}

function RoundCardAndInfo(props) {
    return (
        <Row className="align-items-start w-100 m-0">
            <Col xs={0} md={3} lg={4}></Col>
                <Col xs={12} md={6} lg={4} className="d-flex flex-column align-items-center">
                    <p className="text-center text-secondary fw-semibold mb-2" style={{ letterSpacing: '1px' }}>Nuova carta:</p>
                    <GameCard card={props.roundCard}/>
                </Col>
            <Col xs={12} md={3} lg={4} className="text-end text-break">
                <span className="text-secondary fw-semibold d-block fs-4">Round {props.currRoundNumber}</span>
                <span className="text-danger fw-semibold d-block fs-4">Errori: {props.errors}/3</span>
            </Col>
        </Row>
    );
}

function CardsForm({ cards, selectedPosition, onPositionChange, onSubmit }) {
    // Alternate sequence of radio buttons and cards
    const items = [];
    for (let i = 0; i <= cards.length; i++) {
        // Radio buttons between cards
        items.push(
            <Col xs="auto" key={`radio-${i}`} className="radio-slot d-flex flex-column align-items-center justify-content-center px-1" style={{ minWidth: '32px' }}>
                <Form.Check
                    type="radio"
                    name="insertPosition"
                    value={i}
                    checked={selectedPosition === i}
                    onChange={() => onPositionChange(i)}
                />
            </Col>
        );
        // Card (after each radio button, except the last one)
        if (i < cards.length) {
            items.push(
                <Col xs="auto" key={`card-${cards[i].id}`} className="game-card-item d-flex flex-column align-items-center justify-content-center px-1">
                    <GameCard card={cards[i]}/>
                </Col>
            );
        }
    }

    return (
        <Container fluid className="d-flex flex-column align-items-center">
            <p className="text-center text-secondary fw-semibold mb-2" style={{ letterSpacing: '1px' }}>Le tue carte:</p>
            <Container fluid className="d-flex justify-content-center w-100" style={{ overflowX: 'auto' }}>
                <Form onSubmit={onSubmit} className="m-0 p-0">
                    <Container fluid className="d-flex flex-nowrap">
                        {items}
                    </Container>
                    <Container fluid className="text-center mt-5">
                        <Button type="submit" variant="primary" disabled={selectedPosition === null || (selectedPosition < 0 || selectedPosition >= cards.length)}>Inserisci carta</Button>
                    </Container>
                </Form>
            </Container>
        </Container>
    );
}

export default GamePage;