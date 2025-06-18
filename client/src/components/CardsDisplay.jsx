import { Container, Col } from "react-bootstrap";
import GameCard from "./GameCard";

function CardsDisplay(props) {
    return (
        <Container fluid className="d-flex flex-column align-items-center">
            <p className="text-center text-secondary fw-semibold mb-2 fs-5" style={{ letterSpacing: '1px' }}>Le tue carte:</p>
            <Container fluid className="d-flex justify-content-center w-100" style={{ overflowX: 'auto' }}>
                <div className="d-flex flex-nowrap">
                    {props.cards.map((card) => (
                        <Col xs="auto" key={`card-${card.id}`} className="game-card-item d-flex flex-column align-items-center justify-content-center px-1">
                            <GameCard card={card}/>
                        </Col>
                    ))}
                </div>
            </Container>
        </Container>
    );
}

export default CardsDisplay;