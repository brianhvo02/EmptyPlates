export const 
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    DELETE = 'DELETE';

const fetchAPI = async (url, { method, body, passData = false }, successAction, errorAction) => {
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
    
    if (passData) {
        return {
            data,
            actions: res.ok ? successAction(data) : errorAction(data)
        }
    } else {
        return res.ok ? successAction(data) : errorAction(data);
    }
}

export default fetchAPI;