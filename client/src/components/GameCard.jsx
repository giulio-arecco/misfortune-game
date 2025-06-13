import { Card, Badge } from 'react-bootstrap';
import '../styles/gameCard.css';

function GameCard(props) {
  return (
    <Card className="h-100 shadow">
      <Card.Img variant="top" src={props.card.imagePath} alt={`card_${props.card.id}`} className="game-card-img" />

      <Card.Body className="d-flex flex-column justify-content-between p-2">
        <Card.Title className="fs-6 text-center mb-0 card-title-truncate"> {props.card.name} </Card.Title>

        {props.showMisfortune && (
          <div className="text-center mt-auto pt-2">
            <Badge bg="danger" pill className="px-2 py-1">
              Sfortuna: {props.card.misfortune}
            </Badge>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default GameCard;