import { Row, Col, Button, Container } from 'react-bootstrap';
import { Card, Game, User, Round } from '../../../server/models.mjs';
import { useState } from 'react';
import GameCard from './GameCard';

const user = new User("TestUser", "testuser@gmail.com", 1);
const game = new Game(user.id, new dayjs().format("YYYY-MM-DD"), null, 1);
game.cards = [
    new Card("Ti si rompe la penna proprio durante l’esame.", '/images/cards/broken-pen.jpg', 1.0, 1),
    new Card("Un compagno di corso copia tutto e prende 30 e lode.", '/images/cards/copied-and-passed.png', 2.5, 3),
    new Card("Il caffè della macchinetta è freddo e amaro.", '/images/cards/bad-coffee.png', 2.0, 2),
].sort((a, b) => a.misfortune - b.misfortune);
game.errors = 0;

const roundZero = new Round(game.id, 0, null);
roundZero.cards = game.cards;

function GamePage() {
    [game, setGame] = useState(game);
    [currentRound, setCurrentRound] = useState(roundZero);

    // Round 1 Starts
    const roundCard = new Card("Vai a lezione… ma l’aula è cambiata e non lo sapevi.", '/images/cards/empty-class.png', 19.0);
    setCurrentRound((oldRound) => {
        return { ...oldRound, 
                number: oldRound.number + 1,
                cards: [roundCard] };
    });
    



    return (
        // Navbar + Footer = 56px + 56px = 112px
        <Container fluid className="d-flex flex-column p-0" style={{ height: 'calc(90vh - 112px)', minHeight: 0, overflow: 'hidden' }}> 
            <Container fluid className="d-flex flex-column justify-content-around align-items-stretch h-100">
                <RoundCardAndInfo roundCard={currentRound.cards[0]} currentRound={currentRound} errors={game.errors}/>
                <CardsInHand cards={game.cards} />
                <SelectionForm />
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
                <span className="text-secondary fw-semibold d-block fs-4">Round {props.currentRound}</span>
                <span className="text-danger fw-semibold d-block fs-4">Errori: {props.errors}/3</span>
            </Col>
        </Row>
    );
}

function CardsInHand(props) {
    return (
        <Row className="justify-content-center">
            <Col xs={12}>
                <p className="text-secondary fw-semibold mb-2 text-center fs-5" style={{ letterSpacing: '1px' }}>Le tue carte:</p>
                <Row className="justify-content-center g-3">
                    {props.cards.map(card => (
                        <Col key={card.id} className="game-card-col d-flex">
                            <GameCard card={card} showMisfortune={true} />
                        </Col>
                    ))}
                </Row>
            </Col>
        </Row>
    );
}

function SelectionForm() {
    return (
        <Row className="justify-content-center mt-3">
            <Col xs={12} md={3} lg={4} className="text-center">
                <Button variant="primary">Scegli posizione (placeholder)</Button>
            </Col>
        </Row>
    );
}

export default GamePage;