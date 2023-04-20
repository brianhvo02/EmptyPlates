export const 
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE';

const fetchAPI = async (url, { method, body }, successAction, errorAction) => {
    const token = sessionStorage.getItem('X-CSRF-Token');

    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify(body)
    });

    const newToken = res.headers.get('X-CSRF-Token');
    if (token !== newToken) sessionStorage.setItem('X-CSRF-Token', newToken);

    const data = await res.json();
    
    return res.ok ? successAction(data) : errorAction(data);
}

export default fetchAPI;