import { Row, Col, Button, Container, Form } from 'react-bootstrap';
import { Round } from '../models.mjs';
import { useState, useEffect, useActionState } from 'react';
import { useNavigate } from 'react-router';
import CardsDisplay from './CardsDisplay.jsx';
import GameCard from './GameCard';
import API from '../API.mjs';

function GamePage(props) {
    const [currentRound, setCurrentRound] = useState(null);
    const [errors, setErrors] = useState(0);
    const [hasGameStarted, setHasGameStarted] = useState(false);
    const [hasGameEnded, setHasGameEnded] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    
    // Update the game result in the backend when the game result changes
    useEffect(() => {
        const updateGameResult = async () => {
            if (props.game.result !== null) {
                await API.updateGameResult(props.game.id, props.game.result);
            }
        }
        updateGameResult();
    }, [props.game.result]);

    // Update the round result in the backend when the current round result changes
    useEffect(() => {
        const updateRoundResult = async () => {
            if (currentRound && currentRound.result !== null) {
                await API.updateRoundResult(currentRound.id, currentRound.result);
            }
        }
        updateRoundResult();
    }, [currentRound?.result]);

    // Check for game over conditions
    useEffect(() => {
        // Only run game logic checks if the game has started and not yet ended.
        if (!props.game || !hasGameStarted || hasGameEnded) return;

        if (props.isLoggedIn) {
            if (props.game.cards.length === 6) {
                props.setGame(oldGame => ({ ...oldGame, result: 'win' }));
                setHasGameEnded(true);
            } else if (errors >= 3) {
                props.setGame(oldGame => ({ ...oldGame, result: 'loss' }));
                setHasGameEnded(true);
            }
        }
        else {
            if (props.game.cards.length === 4) {
                props.setGame(oldGame => ({ ...oldGame, result: 'win' }));
                setHasGameEnded(true);
            } else if (errors >= 1) {
                props.setGame(oldGame => ({ ...oldGame, result: 'loss' }));
                setHasGameEnded(true);
            }
        }
    }, [props.game?.cards, errors, hasGameStarted, hasGameEnded, props.isLoggedIn]);

    // Timer effect for each round
    useEffect(() => {
        // Start the timer only when a round is active and waiting for user input
        if (currentRound && currentRound.result === null) {
            setTimeLeft(30);
            const intervalId = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(intervalId);
                        
                        // Atomically update the round and errors
                        setCurrentRound(oldRound => {
                            // If the round result has already been set, it means another
                            // timer instance already ran. Do nothing.
                            if (oldRound.result !== null) {
                                return oldRound;
                            }
                            
                            // This is the first time this action is processed for this round.
                            // Increment errors safely.
                            setErrors(prevErrors => prevErrors + 1);
                            
                            // Return the new state for the round.
                            return { ...oldRound, result: 'loss' };
                        });

                        return 0; // This will be the new value for timeLeft
                    }
                    return prevTime - 1;
                });
            }, 1000);

            // Cleanup function to clear the interval when the round ends or component unmounts
            return () => clearInterval(intervalId);
        }
    }, [currentRound?.result]);

    const handleStartRound = async () => {
        const roundCard = await API.getRandomCardsForGame(props.game.id, 1, false);
        const newRound = await API.createRound(new Round(props.game.id, roundCard));
        setCurrentRound(newRound);

        if (!hasGameStarted) {
            // Executed at the start of the first round
            setHasGameStarted(true);
        }
    }

    const handleStartNewGame = () => {
        setHasGameStarted(false);
        setHasGameEnded(false);
        props.createGame();
    }

    return (
        hasGameEnded ?
        <EndGameLayout
            isLoggedIn={props.isLoggedIn}
            game={props.game}
            currentRound={currentRound}
            errors={errors}
            newGame={handleStartNewGame}
            setIsPlaying={props.setIsPlaying}
        /> 
        :
        hasGameStarted ?
        <InGameLayout
            isLoggedIn={props.isLoggedIn}
            game={props.game}
            setGame={props.setGame}
            currentRound={currentRound}
            setCurrentRound={setCurrentRound}
            errors={errors}
            setErrors={setErrors}
            handleStartRound={handleStartRound}
            setGameHasStarted={setHasGameStarted}
            setHasGameEnded={setHasGameEnded}
            timeLeft={timeLeft}
        /> 
        :
        <StartGameLayout
            game={props.game}
            handleStartGame={handleStartRound}
            setHasGameStarted={setHasGameStarted}
            setHasGameEnded={setHasGameEnded}
            setCurrentRound={setCurrentRound}
            setErrors={setErrors}
            setIsPlaying={props.setIsPlaying}
        />   
    );
}

function StartGameLayout(props) {
    // Reset states when the component mounts
    useEffect(() => {
        props.setIsPlaying(true);
        props.setHasGameStarted(false);
        props.setHasGameEnded(false);
        props.setCurrentRound(null);
        props.setErrors(0);
    }, []);

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
                <RoundHeader isLoggedIn={props.isLoggedIn} roundCard={props.currentRound.cards[0]} roundResult={props.currentRound.result} currRoundNumber={props.currentRound.number} gameResult={props.game.result} errors={props.errors} timeLeft={props.timeLeft}/>

                {props.currentRound.result === null? (
                    <CardsForm 
                        handCards={props.game.cards} 
                        roundCard={props.currentRound.cards[0]}
                        onPositionChange={props.handlePositionChange}
                        errors={props.errors}
                        setErrors={props.setErrors}
                        setGame={props.setGame}
                        setCurrentRound={props.setCurrentRound}
                        setHasGameEnded={props.setHasGameEnded}
                    />
                ) : (
                    <>
                    <CardsDisplay cards={props.game.cards} />
                    <Container fluid className="text-center">
                        <Button variant="primary" size="md" className="px-5 py-3 fs-5" onClick={props.handleStartRound} disabled={props.errors >= 3}>
                            Prossimo Round
                        </Button>
                    </Container>
                    </>
                )}
            </Container>
        </Container>
    );
}

function EndGameLayout(props) {
    const navigate = useNavigate();

    return (
        <Container fluid className="d-flex flex-column p-0" style={{ height: 'calc(90vh - 112px)', minHeight: 0, overflow: 'hidden' }}> 
            <Container fluid className="d-flex flex-column justify-content-around align-items-stretch h-100">
                <RoundHeader isLoggedIn={props.isLoggedIn} roundCard={props.currentRound.cards[0]} roundResult={props.currentRound.result} currRoundNumber={props.currentRound.number} gameResult={props.game.result} errors={props.errors}/>
                <CardsDisplay cards={props.game.cards} />
                <Container fluid className="text-center">
                    <Button variant="primary" size="md" className="px-5 py-3 fs-5 me-3" onClick={() => {
                            props.setIsPlaying(false);
                            navigate('/');
                        }}>
                        Torna alla home
                    </Button>
                    {props.isLoggedIn === true ? (
                        <Button variant="secondary" size="md" className="px-5 py-3 fs-5" onClick={props.newGame}>
                            Nuova partita
                        </Button>
                    ) : (
                        <Button variant="secondary" size="md" className="px-5 py-3 fs-5" onClick={() => {
                                props.setIsPlaying(false);
                                navigate('/login')
                            }}>
                            Login
                        </Button>
                    )}
                </Container>
            </Container>
        </Container>
    );
}

function RoundHeader(props) {
    return (
        <Row className="align-items-start w-100 m-0">
            <Col xs={12} md={3} lg={4} className="text-start">
                {props.roundResult === null && props.gameResult === null && (
                    <span className="mt-2 fs-5 fw-bold text-secondary fs-4">Tempo: {props.timeLeft}s</span>
                )}
            </Col>
            <Col xs={12} md={6} lg={4} className="d-flex flex-column align-items-center">
                {props.roundResult === 'win' && props.gameResult === null && (
                    <span className="px-4 py-2 rounded-pill bg-success text-white fw-bold fs-4" style={{ minWidth: '180px', textAlign: 'center' }}>
                        Inserimento corretto!
                    </span>
                )}
                {props.roundResult === 'loss' && props.gameResult === null && (
                    <span className="px-4 py-2 rounded-pill bg-danger text-white fw-bold fs-4" style={{ minWidth: '180px', textAlign: 'center' }}>
                        Inserimento errato!
                    </span>
                )}
                {props.roundResult === null && props.gameResult === null && (
                    <>
                        <p className="text-center text-secondary fw-semibold mb-2" style={{ letterSpacing: '1px' }}>Nuova carta:</p>
                        <GameCard card={props.roundCard}/>
                    </>
                )}
                {props.gameResult === 'win' && (
                    <span className="px-4 py-2 rounded-pill bg-success text-white fw-bold fs-4" style={{ minWidth: '180px', textAlign: 'center' }}>
                        Hai vinto!
                    </span>
                )}
                {props.gameResult === 'loss' && (
                    <span className="px-4 py-2 rounded-pill bg-danger text-white fw-bold fs-4" style={{ minWidth: '180px', textAlign: 'center' }}>
                        Hai perso!
                    </span>
                )}
            </Col>
            <Col xs={12} md={3} lg={4} className="text-end text-break">
                {props.isLoggedIn && (
                    <>
                        <span className="text-secondary fw-semibold d-block fs-4">Round {props.currRoundNumber}</span>
                        <span className="text-danger fw-semibold d-block fs-4">Errori: {props.errors}/3</span>
                    </>
                )}
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
                props.setCurrentRound(oldRound => ({...oldRound, result: 'win'}));
                
                // if (props.handCards.length === 5) {
                //     props.setHasGameEnded(true);
                // }

                props.setGame((oldGame) => { 
                    // Create a new game state with the card inserted at the correct position
                    const newGame = { 
                        ...oldGame,
                        cards: [
                            ...oldGame.cards.slice(0, insertPosition),
                            card,
                            ...oldGame.cards.slice(insertPosition)
                        ],
                    };
                    
                    // Update the game result if the player has inserted 6 cards correctly
                    // if (newGame.cards.length === 6) {
                    //     newGame.result = 'win';
                    // }

                    return newGame;
                });
            } 
            else {
                props.setCurrentRound(oldRound => ({...oldRound, result: 'loss'}));
                // if (props.errors === 2) {
                //     props.setHasGameEnded(true);
                //     props.setGame((oldGame) => ({ ...oldGame, result: 'loss' }));
                // }
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