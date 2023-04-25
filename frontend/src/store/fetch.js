export const 
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE';

const fetchAPI = async (url, { method, body }, successAction, errorAction) => {
    const token = sessionStorage.getItem('X-CSRF-Token');
    const isFormData = body instanceof FormData;

    const headers = { 'X-CSRF-Token': token };
    if (!isFormData) headers['Content-Type'] = 'application/json';

    const res = await fetch(url, {
        method, headers,
        body: isFormData ? body : JSON.stringify(body)
    });

    const newToken = res.headers.get('X-CSRF-Token');
    if (token !== newToken && res.ok) sessionStorage.setItem('X-CSRF-Token', newToken);

    const data = await res.json();
    
    return res.ok ? successAction(data) : errorAction(data);
}

export default fetchAPI;