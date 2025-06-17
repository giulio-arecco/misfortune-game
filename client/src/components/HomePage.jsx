import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import API from '../API.mjs';
import { Game, Round } from '../models.mjs';

function HomePage(props) {
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    try {
      const newGame = await API.createGame(new Game(1));
      const initialCards = await API.getRandomCardsForGame(newGame.id, 3, true);
      newGame.cards = initialCards.sort((a, b) => a.misfortune - b.misfortune);
      await API.createRound(new Round(newGame.id, initialCards));

      props.setGame(newGame);
      navigate("/game");
    } 
    catch (error) {
      console.error(error);
    }
  }

  return(
    <Container className="flex-grow-1 d-flex flex-column justify-content-center align-items-center mb-5">
      <Button className="btn-lg px-5 py-3 fs-2" variant="primary" onClick={handleCreateGame}>Inizia una partita</Button>
    </Container>
  );
}

export default HomePage;