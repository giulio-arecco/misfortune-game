import { Row, Col, Button, Container } from 'react-bootstrap';
import { Card } from '../../../server/models.mjs';
import GameCard from './GameCard';

function GamePage() {
    const roundCard = new Card("Vai a lezione… ma l’aula è cambiata e non lo sapevi.", '/images/cards/empty-class.png', 19.0);

    const playerCards = [
        new Card("Ti si rompe la penna proprio durante l’esame.", '/images/cards/broken-pen.jpg', 1.0, 1),
        new Card("Un compagno di corso copia tutto e prende 30 e lode.", '/images/cards/copied-and-passed.png', 2.5, 3),
        new Card("Il caffè della macchinetta è freddo e amaro.", '/images/cards/bad-coffee.png', 2.0, 2),
        // new Card("Ti dimentichi di portare la tessera universitaria e non puoi entrare in biblioteca.", '/images/cards/cannot-enter-library.png', 3.0),
        // new Card("Ti si apre la zip dello zaino e perdi appunti importanti.", '/images/cards/losing-notes.png', 5.0),
        // new Card("Ti dimentichi il portafoglio e non puoi comprare nulla al bar.", '/images/cards/forgot-wallet.png', 7.0),
    ];

    playerCards.sort((a, b) => a.misfortune - b.misfortune);

    const currentRound = 1;
    const errors = 2;

    return (
        // Navbar + Footer = 56px + 56px = 112px
        <Container fluid className="d-flex flex-column p-0" style={{ height: 'calc(90vh - 112px)', minHeight: 0, overflow: 'hidden' }}> 
            <Container fluid className="d-flex flex-column justify-content-around align-items-stretch h-100">
                {/* Round card and round info */}
                <Row className="align-items-start w-100 m-0">
                    <Col xs={0} md={3} lg={4}></Col>
                    <Col xs={12} md={6} lg={4} className="d-flex flex-column align-items-center">
                        <p className="text-center text-secondary fw-semibold mb-2 fs-5" style={{ letterSpacing: '1px' }}>Nuova carta:</p>
                        <GameCard card={roundCard} showMisfortune={false} />
                    </Col>
                    <Col xs={12} md={3} lg={4} className="text-end text-break">
                        <span className="text-secondary fw-semibold d-block fs-4">Round {currentRound}</span>
                        <span className="text-danger fw-semibold d-block fs-4">Errori: {errors}/3</span>
                    </Col>
                </Row>

                {/* Cards in hand */}
                <Row className="justify-content-center">
                    <Col xs={12}>
                        <p className="text-secondary fw-semibold mb-2 text-center fs-5" style={{ letterSpacing: '1px' }}>Le tue carte:</p>
                        <Row className="justify-content-center g-3">
                            {playerCards.map(card => (
                                <Col key={card.id} className="game-card-col d-flex">
                                    <GameCard card={card} showMisfortune={true} />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>

                {/* Placeholder form button */}
                <Row className="justify-content-center mt-3">
                    <Col xs={12} md={3} lg={4} className="text-center">
                        <Button variant="primary">Scegli posizione (placeholder)</Button>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default GamePage;