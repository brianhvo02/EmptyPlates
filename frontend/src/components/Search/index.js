import { useSearchParams } from 'react-router-dom';
import SearchBar from '../HomePage/SearchBar';
import './index.css';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSearch, setParams } from '../../store/reservationSearchSlice';

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query');
    const neighborhoodId = searchParams.get('neighborhoodId');
    const cuisineId = searchParams.get('neighborhoodId');

    const dispatch = useDispatch();
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        dispatch(setParams({ query }));
        dispatch(fetchSearch(query))
            .then(data => setSearchResults(data.restaurants ? Object.values(data.restaurants) : []))
    }, [searchParams]);

    return (
        <div>
            <SearchBar disableSearchDropdown={true} />
            <div className='search-container'>
                <div className='search-header'>
                    <h1>You searched for "{query}"</h1>
                    <p>{searchResults.length} restaurant{searchResults.length !== 1 && 's'} match "{query}"</p>
                </div>
            </div>
        </div>
    );
}

function SearchListing({ restaurant }) {

}