import sqlite from 'sqlite3'
import { addGame, addCard, addRound, addUser } from './dao.mjs';
import { Game, Card, Round, User } from './models.mjs';

const cards = [
    new Card("Ti si rompe la penna proprio durante l’esame.", '/images/cards/broken-pen.jpg', 1.0),
    new Card("Il caffè della macchinetta è freddo e amaro.", '/images/cards/bad-coffee.png', 2.0),
    new Card("Un compagno di corso copia tutto e prende 30 e lode.", '/images/cards/copied-and-passed.png', 2.5),
    new Card("Ti dimentichi di portare la tessera universitaria e non puoi entrare in biblioteca.", '/images/cards/cannot-enter-library.png', 3.0),
    new Card("Ti si apre la zip dello zaino e perdi appunti importanti.", '/images/cards/losing-notes.png', 5.0),
    new Card("Ti dimentichi il portafoglio e non puoi comprare nulla al bar.", '/images/cards/forgot-wallet.png', 7.0),
    new Card("La mensa finisce il tuo piatto preferito proprio il giorno in cui vai a pranzo.", '/images/cards/no-more-food.png', 8.0),
    new Card("Trovi un posto in biblioteca ma con il posto vicino occupato da uno che russa.", '/images/cards/snoring-in-library.png', 9.0),
    new Card("Sbagli aula e segui una lezione completamente diversa.", '/images/cards/wrong-class.png', 10.0),
    new Card("La caffetteria universitaria chiude proprio durante la pausa studio.", '/images/cards/closed-cafeteria.png', 11.0),
    new Card("Ti si rompe la bicicletta mentre vai all’università.", '/images/cards/broken-bike.jpg', 13.0),
    new Card("Ti scambi i libri con quelli di un altro corso e studi cose inutili.", '/images/cards/switch-books.jpg', 15.0),
    new Card("L’unico posto libero in aula è accanto al tuo ex.", '/images/cards/sit-net-to-ex.jpg', 16.0),
    new Card("La biblioteca chiude prima proprio il giorno che devi studiare.", '/images/cards/closed-library.jpg', 17.0),
    new Card("Vai a lezione… ma l’aula è cambiata e non lo sapevi.", '/images/cards/empty-class.png', 19.0),
    new Card("Ti dimentichi il caricabatterie a casa.", '/images/cards/forgot-charger.jpg', 20.0),
    new Card("Ti porti dietro il PC per studiare in aula… ma non c’è una presa libera.", '/images/cards/no-available-outlets.png', 21.0),
    new Card("Vai all’università per una lezione che è stata cancellata, ma nessuno l’ha detto.", '/images/cards/class-cancelled-without-notice.png', 24.0),
    new Card("Scopri che il libro di testo è esaurito ovunque.", '/images/cards/book-out-of-stock.jpg', 26.0),
    new Card("Ti ritrovi in fila lunghissima per la stampa degli appunti.", '/images/cards/line-to-print-notes.jpg', 28.0),
    new Card("Arrivi in ritardo e la porta dell’aula si chiude davanti a te.", '/images/cards/late-to-class.jpg', 30.0),
    new Card("Ti svegli tardi e perdi il pullman dell’università.", '/images/cards/missed-the-bus.jpg', 31.0),
    new Card("Ti confondi e partecipi all’esame di un altro corso.", '/images/cards/attended-wrong-exam.jpg', 32.0),
    new Card("Sbagli l’orario dell’esame e arrivi un’ora dopo.", '/images/cards/late-to-exam.jpg', 34.0),
    new Card("Ti dimentichi di salvare il file e il pc si spegne.", '/images/cards/laptop-died-before-saving.jpg', 36.0),
    new Card("Il wifi cade proprio mentre devi consegnare il lavoro online.", '/images/cards/no-wifi.jpg', 38.0),
    new Card("Consegni il progetto in ritardo di un minuto… e il portale lo rifiuta.", '/images/cards/submission-rejected.png', 40.0),
    new Card("La tua password universitaria scade proprio il giorno della consegna.", '/images/cards/password-expired.jpg', 43.0),
    new Card("Ti assegnano un gruppo di lavoro dove nessuno collabora.", '/images/cards/inefficient-team.jpg', 46.0),
    new Card("Il tuo coinquilino fa festa la notte prima di un esame importante.", '/images/cards/roommate-is-partying-late.jpg', 48.0),
    new Card("La stampante dell’università si inceppa proprio prima di stampare la tesi.", '/images/cards/printer-out-of-order.jpg', 50.0),
    new Card("La tua sveglia non suona e perdi la lezione importante.", '/images/cards/slept-in', 54.0),
    new Card("Il prof ha corretto male la tua prova, ti toglie punti a caso.", '/images/cards/wrong-corrections.jpg', 56.0),
    new Card("Scopri di aver consegnato il file sbagliato.", '/images/cards/wrong-file-submitted.jpg', 58.0),
    new Card("La connessione va a singhiozzo durante un esame online.", '/images/cards/poor-connection.jpg', 60.0),
    new Card("Il tuo progetto sparisce dal drive condiviso.", '/images/cards/project-missing-from-cloud.jpg', 62.0),
    new Card("Ti si rovescia il caffè sul laptop.", '/images/cards/spilled-coffee-on-laptop.jpg', 64.0),
    new Card("Il progetto di gruppo viene sabotato da un errore del server.", '/images/cards/', 66.0),
    new Card("Il professore cambia l’orario dell’esame all’ultimo minuto.", '/images/cards/', 68.0),
    new Card("Ti ammali e devi saltare la settimana di lezione più importante.", '/images/cards/', 70.0),
    new Card("Hai studiato tutto il programma… tranne l’unico argomento dell’esame.", '/images/cards/', 73.0),
    new Card("Ti dimentichi di iscriversi all’esame e lo perdi.", '/images/cards/', 75.0),
    new Card("La batteria del portatile si scarica proprio durante la presentazione.", '/images/cards/', 77.0),
    new Card("Ti dimentichi di fare il backup dei dati e perdi tutto.", '/images/cards/', 80.0),
    new Card("Prendi 17 all’unico esame che ti manca per laurearti entro l’anno.", '/images/cards/', 83.0),
    new Card("Il corso che ti serve per laurearti viene spostato nel semestre successivo.", '/images/cards/', 85.0),
    new Card("Sbagli la data di consegna e perdi punti.", '/images/cards/', 87.0),
    new Card("Il relatore della tesi sparisce e non risponde più.", '/images/cards/', 95.0),
    new Card("Il prof annulla l’appello e sposta tutto al mese dopo.", '/images/cards/', 98.0),
    new Card("Ti si rompe lo zaino e perdi tutto per strada.", '/images/cards/', 100.0),
];

const db = new sqlite.Database('./database.db', (err) => {if (err) throw err;});
main();

async function main() {
    await clearTables();
    // for (const card of cards) {
    //     await addCard(card);
    // }
    db.close();
}

function clearTables() {
    return new Promise(async (resolve, reject) => {
        const runQuery = (sql) => {
            return new Promise((resolve, reject) => {
                db.run(sql, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }

        try {
            await runQuery("BEGIN TRANSACTION");
            await runQuery("DELETE FROM Round");
            await runQuery("DELETE FROM Game");
            await runQuery("DELETE FROM Card");
            await runQuery("DELETE FROM User");
            await runQuery("DELETE FROM sqlite_sequence WHERE name IN ('Card', 'Game', 'Round', 'User')");
            await runQuery("COMMIT");
            resolve("Tables cleared successfully.");
        } catch (err) {
            reject(err);
        }
    });
}
