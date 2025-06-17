import { Row, Col, Button, Container, Form } from 'react-bootstrap';
import { Card, Game, User, Round } from '../models.mjs';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import GameCard from './GameCard';

const user = new User("TestUser", "testuser@gmail.com", 1);
const fakeGame = new Game(user.id, new dayjs().format("YYYY-MM-DD"), null, 1);
fakeGame.cards = [
    new Card("Ti si rompe la penna proprio durante l’esame.", '/images/cards/broken-pen.jpg', 1.0, 1),
    new Card("Un compagno di corso copia tutto e prende 30 e lode.", '/images/cards/copied-and-passed.png', 2.5, 3),
    new Card("Il caffè della macchinetta è freddo e amaro.", '/images/cards/bad-coffee.png', 2.0, 2),
    new Card("Ti si rompe la penna proprio durante l’esame.", '/images/cards/broken-pen.jpg', 1.0, 1),
    new Card("Un compagno di corso copia tutto e prende 30 e lode.", '/images/cards/copied-and-passed.png', 2.5, 3),
].sort((a, b) => a.misfortune - b.misfortune);
fakeGame.errors = 0;

const roundZero = new Round(fakeGame.id, 0, null);
roundZero.cards = fakeGame.cards;

function GamePage() {
    const [game, setGame] = useState(fakeGame);
    const [currentRound, setCurrentRound] = useState(roundZero);
    const [selectedPosition, setSelectedPosition] = useState(0);
    
    // Round 1 Starts
    useEffect(() => {
        const roundCard = new Card("Vai a lezione… ma l’aula è cambiata e non lo sapevi.", '/images/cards/empty-class.png', 19.0);
        setCurrentRound((oldRound) => ({
            ...oldRound,
            number: oldRound.number + 1,
            cards: [roundCard]
        }));
    }, []);

    const handlePositionChange = (pos) => setSelectedPosition(pos);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Carta inserita in posizione ${selectedPosition}`);
    };

    return (
        <Container fluid className="d-flex flex-column p-0" style={{ height: 'calc(90vh - 112px)', minHeight: 0, overflow: 'hidden' }}> 
            <Container fluid className="d-flex flex-column justify-content-around align-items-stretch h-100">
                <RoundCardAndInfo roundCard={currentRound.cards[0]} currRoundNumber={currentRound.number} errors={game.errors}/>
                <CardsForm 
                    cards={game.cards} 
                    selectedPosition={selectedPosition} 
                    onPositionChange={handlePositionChange}
                    onSubmit={handleSubmit}
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
                    <p className="text-center text-secondary fw-semibold mb-2 fs-5" style={{ letterSpacing: '1px' }}>Nuova carta:</p>
                    <GameCard card={props.roundCard} showMisfortune={false} />
                </Col>
            <Col xs={12} md={3} lg={4} className="text-end text-break">
                <span className="text-secondary fw-semibold d-block fs-4">Round {props.currRoundNumber}</span>
                <span className="text-danger fw-semibold d-block fs-4">Errori: {props.errors}/3</span>
            </Col>
        </Row>
    );
}

// function CardsInHand(props) {
//     return (
//         <Row className="justify-content-center">
//             <Col xs={12}>
//                 <p className="text-secondary fw-semibold mb-2 text-center fs-5" style={{ letterSpacing: '1px' }}>Le tue carte:</p>
//                 <Row className="justify-content-center g-3">
//                     {props.cards.map(card => (
//                         <Col key={card.id} className="game-card-col d-flex">
//                             <GameCard card={card} showMisfortune={true} />
//                         </Col>
//                     ))}
//                 </Row>
//             </Col>
//         </Row>
//     );
// }

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
                    <GameCard card={cards[i]} showMisfortune={true} />
                </Col>
            );
        }
    }

    return (
        <Container fluid className="d-flex flex-column align-items-center">
            <p className="text-center text-secondary fw-semibold mb-2 fs-5" style={{ letterSpacing: '1px' }}>Le tue carte:</p>
            <Container fluid className="d-flex justify-content-center w-100" style={{ overflowX: 'auto' }}>
                <Form onSubmit={onSubmit} className="m-0 p-0">
                    <Container fluid className="d-flex flex-nowrap">
                        {items}
                    </Container>
                    <Container fluid className="text-center mt-5">
                        <Button type="submit" variant="primary">Inserisci carta</Button>
                    </Container>
                </Form>
            </Container>
        </Container>
    );
}

export default GamePage;