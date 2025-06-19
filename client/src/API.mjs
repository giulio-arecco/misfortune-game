
const SERVER_URL = 'http://localhost:3001';

const createGame = async (game) => {
  const response = await fetch(`${SERVER_URL}/api/games`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(game),
  });
  
  if (!response.ok) {
    const errDetails = await response.json();
    if (response.status === 400 && errDetails.errors) {
      // Handle express-validator errors
      throw new Error(`Validation error: ${errDetails.errors[0].msg}`);
    } else {
      throw new Error(`${response.status}: ${errDetails.error || 'Cannot create game'}`);
    }
  }
  
  return response.json();
};

const getRandomCardsForGame = async (gameId, count, getMisfortune) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}/randomCards?n=${count}&getMisfortune=${getMisfortune}`);
  
  if (response.status === 404) {
    return []; // No cards found
  } else if (!response.ok) {
    const errDetails = await response.json();
    if (response.status === 400 && errDetails.errors) {
      // Handle express-validator errors
      throw new Error(`Validation error: ${errDetails.errors[0].msg}`);
    } else {
        throw new Error(`${response.status}: ${errDetails.error || 'Cannot get random cards'}`);
    }
  }
  
  return response.json();
};

const updateGameResult = async (gameId, result) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ result }),
  });
  
  if (!response.ok) {
    const errDetails = await response.json();
    if (response.status === 400 && errDetails.errors) {
      // Handle express-validator errors
      throw new Error(`Validation error: ${errDetails.errors[0].msg}`);
    } else {
        throw new Error(`${response.status}: ${errDetails.error || 'Cannot update game result'}`);
    }
  }
  
  return response.json();
};

const createRound = async (round) => {
  const response = await fetch(`${SERVER_URL}/api/rounds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(round),
  });
  
  if (!response.ok) {
    const errDetails = await response.json();
    if (response.status === 400 && errDetails.errors) {
      // Handle express-validator errors
      throw new Error(`Validation error: ${errDetails.errors[0].msg}`);
    } else {
        throw new Error(`${response.status}: ${errDetails.error || 'Cannot create round'}`);
    }
  }
  
  return response.json();
};

const updateRoundResult = async (roundId, result) => {
  const response = await fetch(`${SERVER_URL}/api/rounds/${roundId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ result }),
  });
  
  if (!response.ok) {
    const errDetails = await response.json();
    if (response.status === 400 && errDetails.errors) {
      // Handle express-validator errors
      throw new Error(`Validation error: ${errDetails.errors[0].msg}`);
    } else {
        throw new Error(`${response.status}: ${errDetails.error || 'Cannot update round result'}`);
    }
  }
  
  return response.json();
};

const getUserGames = async (userId) => {
  const response = await fetch(`${SERVER_URL}/api/users/${userId}/games`, {
    credentials: 'include'
  });
  
  if (response.status === 404) {
    return []; // No games found for this user
  } else if (!response.ok) {
    const errDetails = await response.json();
    if (response.status === 400 && errDetails.errors) {
      // Handle express-validator errors
      throw new Error(`Validation error: ${errDetails.errors[0].msg}`);
    } else {
        throw new Error(`${response.status}: ${errDetails.error || 'Cannot get user games'}`);
    }
  }
  
  return response.json();
};

const getCard = async (cardId) => {
  const response = await fetch(`${SERVER_URL}/api/cards/${cardId}`);
  
  if (response.status === 404) {
    throw new Error('Card not found');
  } else if (!response.ok) {
    const errDetails = await response.json();
    if (response.status === 400 && errDetails.errors) {
      // Handle express-validator errors
      throw new Error(`Validation error: ${errDetails.errors[0].msg}`);
    } else {
        throw new Error(`${response.status}: ${errDetails.error || 'Cannot get card'}`);
    }
  }
  
  return response.json();
};

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;
  }
};

const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}

const API = {
  createGame,
  getRandomCardsForGame,
  updateGameResult,
  createRound,
  updateRoundResult,
  getUserGames,
  getCard,
  logIn,
  getUserInfo,
  logOut
};
export default API;