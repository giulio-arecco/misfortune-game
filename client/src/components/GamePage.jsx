import { Row, Col, Button, Container, Form } from 'react-bootstrap';
import { Card, Game, User, Round } from '../models.mjs';
import { useState, useEffect, useActionState } from 'react';
import CardsDisplay from './CardsDisplay.jsx';
import GameCard from './GameCard';
import API from '../API.mjs';

function GamePage(props) {
    const [currentRound, setCurrentRound] = useState(null);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [isCorrectPosition, setIsCorrectPosition] = useState(null);
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
    
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     // alert(`Carta inserita in posizione ${selectedPosition}`);
    // };

    const handleStartGame = async () => {
        const roundCard = await API.getRandomCardsForGame(props.game.id, 1, false);
        const newRound = await API.createRound(new Round(props.game.id, roundCard));
        setCurrentRound(newRound);
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
            setGame={props.setGame}
            currentRound={currentRound}
            errors={errors}
            setErrors={setErrors}
            isCorrectPosition={isCorrectPosition}
            setIsCorrectPosition={setIsCorrectPosition}
            // selectedPosition={selectedPosition}
            // handlePositionChange={handlePositionChange}
            // handleSubmit={handleSubmit}
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
                <RoundCardAndInfo roundCard={props.currentRound.cards[0]} isCorrectPosition={props.isCorrectPosition} currRoundNumber={props.currentRound.number} errors={props.errors}/>

                {props.isCorrectPosition === null? (
                    <CardsForm 
                        handCards={props.game.cards} 
                        roundCard={props.currentRound.cards[0]}
                        // selectedPosition={props.selectedPosition} 
                        setIsCorrectPosition={props.setIsCorrectPosition}
                        onPositionChange={props.handlePositionChange}
                        setGame={props.setGame}
                    />
                ) : (<CardsDisplay cards={props.game.cards} />)}
            </Container>
        </Container>
    );
}

function RoundCardAndInfo(props) {
    return (
        <Row className="align-items-start w-100 m-0">
            <Col xs={0} md={3} lg={4}></Col>
                <Col xs={12} md={6} lg={4} className="d-flex flex-column align-items-center">
                    {props.isCorrectPosition === true && (
                        <span className="px-4 py-2 rounded-pill bg-success text-white fw-bold fs-5" style={{ minWidth: '180px', textAlign: 'center' }}>
                            Inserimento corretto!
                        </span>
                    )}
                    {props.isCorrectPosition === false && (
                        <span className="px-4 py-2 rounded-pill bg-danger text-white fw-bold fs-5" style={{ minWidth: '180px', textAlign: 'center' }}>
                            Inserimento errato!
                        </span>
                    )}
                    {props.isCorrectPosition === null && (
                        <>
                            <p className="text-center text-secondary fw-semibold mb-2" style={{ letterSpacing: '1px' }}>Nuova carta:</p>
                            <GameCard card={props.roundCard}/>
                        </>
                    )}
                </Col>
            <Col xs={12} md={3} lg={4} className="text-end text-break">
                <span className="text-secondary fw-semibold d-block fs-4">Round {props.currRoundNumber}</span>
                <span className="text-danger fw-semibold d-block fs-4">Errori: {props.errors}/3</span>
            </Col>
        </Row>
    );
}

function CardsForm(props) {
    const [selectedPosition, setSelectedPosition] = useState(-1);
    const onPositionChange = (pos) => setSelectedPosition(pos);

    const [formState, formAction, isPending] = useActionState(
        async (prevState, formData) => {
            let { insertPosition, prevMisfortune, nextMisfortune } = JSON.parse(formData.get('insertPosition'));
            insertPosition = parseInt(insertPosition);
            prevMisfortune = prevMisfortune !== null ? parseInt(prevMisfortune) : null;
            nextMisfortune = nextMisfortune !== null ? parseInt(nextMisfortune) : null;

            const card = await API.getCard(props.roundCard.id);
            const misfortune = card.misfortune;

            const correctPosition = (prevMisfortune === null && misfortune < nextMisfortune) ||
                (nextMisfortune === null && misfortune > prevMisfortune) ||
                (misfortune > prevMisfortune && misfortune < nextMisfortune)

            if (correctPosition) {
                props.setGame((oldGame) => { 
                    const newGame = { 
                        ...oldGame,
                        cards: [
                            ...oldGame.cards.slice(0, insertPosition),
                            card,
                            ...oldGame.cards.slice(insertPosition)
                        ],
                    };

                    return newGame;
                });
                props.setIsCorrectPosition(true);
            } 
            else {
                props.setIsCorrectPosition(false);
                props.setErrors((prevErrors) => prevErrors + 1);
            }

            return { insertPosition : null };
        },
        { insertPosition: null }
    );


    // Alternate sequence of radio buttons and cards
    const items = [];
    for (let i = 0; i <= props.handCards.length; i++) {
        const prevMisfortune = i > 0 ? props.handCards[i - 1].misfortune : null;
        const nextMisfortune = i < props.handCards.length ? props.handCards[i].misfortune : null;
        const radioValue = JSON.stringify({ insertPosition: i, prevMisfortune, nextMisfortune });

        // Radio buttons between cards
        items.push(
            <Col xs="auto" key={`radio-${i}`} className="radio-slot d-flex flex-column align-items-center justify-content-center px-1" style={{ minWidth: '32px' }}>
                <Form.Check
                    type="radio"
                    name="insertPosition"
                    value={radioValue}
                    checked={selectedPosition === i}
                    onChange={() => onPositionChange(i)}
                    disabled={isPending}
                />
            </Col>
        );
        // Card (after each radio button, except the last one)
        if (i < props.handCards.length) {
            items.push(
                <Col xs="auto" key={`card-${props.handCards[i].id}`} className="game-card-item d-flex flex-column align-items-center justify-content-center px-1">
                    <GameCard card={props.handCards[i]}/>
                </Col>
            );
        }
    }

    return (
        <Container fluid className="d-flex flex-column align-items-center">
            <p className="text-center text-secondary fw-semibold mb-2" style={{ letterSpacing: '1px' }}>Le tue carte:</p>
            <Container fluid className="d-flex justify-content-center w-100" style={{ overflowX: 'auto' }}>
                <Form action={formAction} className="m-0 p-0">
                    <Container fluid className="d-flex flex-nowrap">
                        {items}
                    </Container>
                    <Container fluid className="text-center mt-5">
                        <Button type="submit" variant="primary" disabled={isPending || selectedPosition === null || (selectedPosition < 0 || selectedPosition > props.handCards.length)}>Inserisci carta</Button>
                    </Container>
                </Form>
            </Container>
        </Container>
    );
}

export default GamePage;