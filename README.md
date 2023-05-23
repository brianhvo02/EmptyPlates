# EmptyPlates - Bay Area Transit Data Visualizer
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./logo-alt.png">
  <img alt="logo" src="./logo.png">
</picture>

## Background

EmptyPlates, an OpenTable clone, is a restaurant reservation application that allows patrons to search for and reserve a table at a restaurant that is on the platform, as well as leave reviews and ratings of their visit for other users to read.

[Try it now!](https://emptyplates.brianhuyvo.com)

## Overview

With EmptyPlates, users will be able to:
- Use the demo user to create a restaurant and assign it to a neighborhood and cuisine
- Use the demo user to create available tables for a restaurant
- Reserve a table at a restaurant whether or not you are logged in
- Logged in users can edit their reservation or look at past ones
- Write ratings and/or reviews for a restaurant

## Code snippets

### Operation Modal
```jsx
import './index.css';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantUrl } from '../../store/restaurantSlice';

export default function OperationModal({urlId, closeModal}) {
    const modalRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => !modalRef.current || modalRef.current.classList.add('modal-show'), 100);
    }, [modalRef]);

    return (
        <div className='modal-container'>
            <div className='modal' ref={modalRef}>
                <h1>Operation successful! Where do you want to go next?</h1>
                <button onClick={() => navigate('/')} className='reservation-button'>
                    Go to homepage
                </button>
                <button onClick={() => navigate(restaurantUrl(urlId))} className='reservation-button'>
                    Go to restaurant page
                </button>
                <button onClick={() => {
                    closeModal(modalRef);
                    navigate(restaurantUrl(urlId) + '/edit');
                }} className='reservation-button'>Continue to edit restaurant</button>
            </div>
        </div>
    )
}
```

### Custom `fetch`

```js
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
```

## Libraries and APIs

- Ruby on Rails
- React.js
- OpenAI completions
- Yelp Fusion API