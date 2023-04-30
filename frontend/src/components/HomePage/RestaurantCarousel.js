import './RestaurantCarousel.css';
import { restaurantUrl } from '../../store/restaurantSlice';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleLeft, faChevronCircleRight, faStar } from '@fortawesome/free-solid-svg-icons';
import { convertRemToPixels } from '../../utils';
import { useCuisineSlice } from '../../store/cuisineSlice';
import { useNeighborhoodSlice } from '../../store/neighborhoodSlice';

export default function RestaurantCarousel({header, restaurants}) {
    const navigate = useNavigate();
    const cuisineSlice = useCuisineSlice();
    const neighborhoodSlice = useNeighborhoodSlice();
    const carouselRef = useRef();

    const [carouselSlide, setCarouselSlide] = useState(0);

    const ratingPlaceholder = 3;
    const reviewCountPlaceholder = 150;

    return (
        <div className='restaurant-carousel'>
            <h1 className='carousel-header'>{header}</h1>
            <FontAwesomeIcon className='carousel-control-icon control-left' icon={faChevronCircleLeft} 
                visibility={carouselSlide === 0 ? 'hidden' : ''}
                onClick={() => {
                    if (carouselSlide === 0) return;
                    carouselRef.current.scrollTo({
                        top: 0,
                        left: (carouselSlide - 1) * convertRemToPixels(79.16),
                        behavior: 'smooth'
                    });
                    setCarouselSlide(prev => prev - 1);
                }}/>
            <FontAwesomeIcon className='carousel-control-icon control-right' icon={faChevronCircleRight} 
                visibility={carouselSlide >= (restaurants.length / 5 - 1) ? 'hidden' : ''}
                onClick={() => {
                    if (carouselSlide >= (restaurants.length / 5 - 1)) return;
                    carouselRef.current.scrollTo({
                        top: 0,
                        left: (carouselSlide + 1) * convertRemToPixels(79.16),
                        behavior: 'smooth'
                    });
                    setCarouselSlide(prev => prev + 1);
                }}/>
            <ul className='carousel-content' ref={carouselRef}>
                {restaurants?.map((restaurant) =>
                    <li key={restaurant?.id} className='carousel-restaurant'
                        onClick={() => navigate(restaurantUrl(restaurant?.urlId))}
                    >
                        <img src={restaurant?.imageUrl} alt={restaurant?.name}
                            className='carousel-restaurant-image' />
                        <div className='carousel-restaurant-info'>
                            <h2 className='carousel-restaurant-name'>{restaurant?.name}</h2>
                            <div className='carousel-restaurant-reviews'>
                                <span className='review-ratings'>
                                    {Array.from(Array(5).keys()).map(i => 
                                        <FontAwesomeIcon key={`rating-${restaurant?.id}-${i}`} 
                                            icon={faStar} className='star-icon'
                                            style={{
                                                color: i < ratingPlaceholder 
                                                    ? '#3795DA' 
                                                    : '#E1E1E1'
                                            }}
                                        />
                                    )}
                                </span>
                                <span className='review-count'>
                                    {reviewCountPlaceholder} reviews
                                </span>
                            </div>
                            <div className='carousel-restaurant-details'>
                                <span className='carousel-restaurant-detail'>
                                    {cuisineSlice?.[restaurant?.cuisineId]?.name}
                                </span>
                                <span className='carousel-restaurant-detail'>
                                    {Array.from(Array(4).keys()).map(i =>
                                        <span key={`price-${restaurant?.id}-${i}`} 
                                            style={{
                                                color: i < restaurant?.priceRange 
                                                    ? 'black' 
                                                    : '#E1E1E1'
                                            }}>$</span>
                                    )}
                                </span>
                                <span className='carousel-restaurant-detail'>
                                    {neighborhoodSlice?.[restaurant?.neighborhoodId]?.name}
                                </span>
                            </div>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    )
}