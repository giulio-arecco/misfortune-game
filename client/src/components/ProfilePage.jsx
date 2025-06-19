import { useState, useEffect } from 'react';
import API from '../API.mjs';
import { Container, Row, Col, Card, ListGroup, Spinner, Alert, Button } from 'react-bootstrap';
import dayjs from 'dayjs';
import { Link } from 'react-router';


function ProfilePage(props) {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserGames = async () => {
            if (props.user) {
                try {
                    const games = await API.getUserGames(props.user.id);
                    setGames(games);
                    setLoading(false);
                }
                catch (err) {
                    props.setMessage({msg: 'Errore nel recupero delle partite', type: 'danger'});
                    setLoading(false);
                }
            }
        }
        getUserGames();
    }, [props.user]);

    if (loading) {
        return <Container className="text-center mt-5"><Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner></Container>;
    }

    const getTotalCards = (game) => {
        return game.rounds.reduce((total, round) => {
            if (round.number === 0 || round.result === 'win') {
                return total + round.cards.length;
            }
            return total;
        }, 0);
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <h2>Cronologia partite di {props.user.username}</h2>
                </Col>
                <Col xs="auto">
                    <Link to="/">
                        <Button variant="secondary">Torna alla Home</Button>
                    </Link>
                </Col>
            </Row>
            {games.length === 0 ? (
                <Alert variant="info" className="mt-3">Nessuna partita ancora completata.</Alert>
            ) : (
                games.map(game => (
                    <Card key={game.id} className="mb-4">
                        <Card.Header as="h5">
                            Partita del {dayjs(game.date).format('DD/MM/YYYY')} - Esito: <span className={`fw-bold ${game.result === 'win' ? 'text-success' : 'text-danger'}`}>{game.result === 'win' ? 'Vinta' : 'Persa'}</span>
                        </Card.Header>
                        <Card.Body>
                            <Card.Subtitle className="mb-2 text-muted">
                                Totale carte raccolte: {getTotalCards(game)}
                            </Card.Subtitle>
                            <ListGroup variant="flush">
                                {game.rounds.sort((a, b) => a.number - b.number).map(round => (
                                    <div key={round.id}>
                                        {round.cards.map(card => (
                                            <ListGroup.Item key={card.id}>
                                                <strong>{card.name}</strong>
                                                {round.number > 0 ? 
                                                    <span className="ms-2">- Round {round.number} (esito: {round.result === 'win' ? 'vinto' : 'perso'})</span> : 
                                                    <span className="ms-2 text-muted">- Carta iniziale</span>
                                                }
                                            </ListGroup.Item>
                                        ))}
                                    </div>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    );
}

export default ProfilePage;