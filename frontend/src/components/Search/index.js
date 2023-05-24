import { Link, useSearchParams } from 'react-router-dom';
import SearchBar from '../HomePage/SearchBar';
import './index.css';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSearch, setParams } from '../../store/reservationSearchSlice';
import { useNeighborhoodShallow, useNeighborhoodSlice } from '../../store/neighborhoodSlice';
import { useCuisine, useCuisineSlice } from '../../store/cuisineSlice';
import { restaurantUrl } from '../../store/restaurantSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock, faLocationDot, faStar, faUser, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { createPortal } from 'react-dom';
import LoadingModal from '../Modal/LoadingModal';

function SearchListing({ restaurant }) {
    const neighborhoodSlice = useNeighborhoodSlice();
    const cuisineSlice = useCuisineSlice();

    return (
        <Link to={restaurantUrl(restaurant.urlId)}>
            <img src={restaurant.imageUrl} />
            <div className='search-result-content'>
                <h3>{restaurant.name}</h3>
                <p>
                    {Array.from(Array(5).keys()).map(i => 
                        <FontAwesomeIcon key={`rating-${restaurant.id}-${i}`} 
                            icon={faStar} className='star-icon'
                            style={{
                                color: i < Math.round(restaurant.reviewBreakdown.overall) 
                                    ? '#3795DA' 
                                    : '#E1E1E1'
                            }}
                        />
                    )}
                    <span>{restaurant.reviewBreakdown.overall ? parseFloat(restaurant.reviewBreakdown.overall).toFixed(1) : 0}</span>
                    <span>({restaurant.reviewCount || 0})</span>
                </p>
                <p className='search-result-row'>
                    <span>
                        {Array.from(Array(4).keys()).map(i =>
                            <span key={`price-${restaurant?.id}-${i}`} 
                                style={{
                                    color: i < restaurant?.priceRange 
                                    ? 'black' 
                                    : '#E1E1E1'
                                }}>$</span>
                        )}
                    </span>
                    <span>{cuisineSlice[restaurant.cuisineId].name}</span>
                    <span>{neighborhoodSlice[restaurant.neighborhoodId].name}</span>
                </p>
            </div>
        </Link>
    )
}

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const query = searchParams.get('query');
    const neighborhoodId = searchParams.get('neighborhoods');
    const cuisineId = searchParams.get('cuisines');
    const currentPage = parseInt(searchParams.get('page')) || 1;

    const neighborhood = useNeighborhoodShallow(neighborhoodId);
    const cuisine = useCuisine(cuisineId);
    
    const currentSearch = useMemo(() => query ? query : neighborhood ? neighborhood.name : cuisine ? cuisine.name : '?', [query, neighborhood, cuisine])

    const dispatch = useDispatch();
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (currentSearch) dispatch(setParams({ query: currentSearch }));
        dispatch(fetchSearch(searchParams))
            .then(({ restaurants, count }) => {
                setSearchResults(restaurants ? Object.values(restaurants) : []);
                setCount(count);
                setLoading(false);
            })
    }, [searchParams, currentSearch]);

    const handlePageClick = e => {
        setLoading(true);
        const page = e.target.dataset.page;
        setSearchParams({ ...Object.fromEntries(searchParams), page });
    }

    return (
        <>
            {
                loading &&
                createPortal(
                    <LoadingModal />,
                    document.body
                )
            }
            <SearchBar />
            { (query || neighborhoodId || cuisineId) &&
            <div className='search'>
                <div className='search-container'>
                    <div className='search-header'>
                        <h1>Results for {currentSearch}</h1>
                        <p>{count} result{searchResults.length !== 1 && 's'} for {currentSearch}</p>
                    </div>
                    <div className='search-results'>
                        <ul>
                            {
                                searchResults.map(result => 
                                    <li key={result.id}>
                                        <SearchListing restaurant={result} />
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                    <div className='search-page'>
                        <span onClick={() => currentPage > 1 && setSearchParams({ 
                            ...Object.fromEntries(searchParams), 
                            page: currentPage - 1 
                        })}>{'<'}</span>
                        {
                            Array.from(Array(Math.ceil(count / 5)).keys())
                                .map(i => 
                                    <span style={{
                                        fontWeight: currentPage === i + 1 ? 'bold' : 'normal'
                                    }} data-page={i + 1} onClick={handlePageClick}>{i + 1}</span>
                                )
                        }
                        <span onClick={() => currentPage < Math.ceil(count / 5) && setSearchParams({ 
                            ...Object.fromEntries(searchParams), 
                            page: currentPage + 1 
                        })}>{'>'}</span>
                    </div>
                </div>
            </div>
            }
        </>
    );
}