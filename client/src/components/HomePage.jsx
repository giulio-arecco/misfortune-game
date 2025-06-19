import { Container, Button, Card } from 'react-bootstrap';

function HomePage(props) {
  return(
    <Container className="flex-grow-1 d-flex flex-column justify-content-center align-items-center mb-5">
      <p className="fs-1 text-center mb-4">
        Benvenuto nel Gioco della Sfortuna!
      </p>
      <Button className="btn-lg px-5 py-3 fs-2" variant="primary" onClick={props.createGame}>{props.isLoggedIn === true? "Inizia una partita" : "Gioca la Demo"}</Button>

      {!props.isLoggedIn && (
        <Card className="mt-5" style={{ maxWidth: '800px' }}>
          <Card.Header as="h4" className="text-center">Regole del Gioco</Card.Header>
          <Card.Body>
            <Card.Text>
              Riceverai tre carte iniziali, di cui ti verrà mostrato l'indice di sfortuna.
            </Card.Text>
            <Card.Text>
              Ti verrà mostrata una situazione orribile (solo nome e immagine, senza indice di sfortuna), diversa da quelle che hai già. Dovrai indovinare dove si colloca, come indice di sfortuna, tra le tue carte (che vedrai ordinate per indice di sfortuna crescente).
            </Card.Text>
            <Card.Text>
              Se indovini la posizione entro 30 secondi, ottieni la carta e ne scopri tutti i dettagli. Se sbagli o scade il tempo, non ottieni la carta e non la rivedrai in questa partita.
            </Card.Text>
            <Card.Text>
              Dopo ogni round, vedrai un messaggio con l’esito e potrai iniziare il round successivo quando vuoi.
            </Card.Text>
            <Card.Text>
              Vinci se raccogli 6 carte. Perdi se sbagli la posizione 3 volte.
            </Card.Text>
          </Card.Body>
        </Card>
      )}

    </Container>
  );
}

export default HomePage;