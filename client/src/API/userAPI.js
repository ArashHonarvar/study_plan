const SERVER_URL = 'http://localhost:3001/api/';

async function getUserInfo() {
    const url = SERVER_URL + 'sessions/current';
    const response = await fetch(url, {
        credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
        return user;
    } else {
        throw user;  // an object with the error coming from the server
    }
}

async function logIn(credentials) {
    const url = SERVER_URL + 'sessions';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const errDetails = await response.text();
        throw errDetails;
    }
}

async function logOut() {
    const url = SERVER_URL + 'sessions/current'
    const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (response.ok)
        return null;
}



const userAPI = { getUserInfo, logIn, logOut };
export default userAPI;