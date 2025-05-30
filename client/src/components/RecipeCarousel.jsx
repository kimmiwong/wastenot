import Slider from 'react-slick';
import RecipeCard from './RecipeCard';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function RecipeCarousel({ recipes, showTrashInsteadOfHeart }) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    return (
        <Slider {...settings}>
            {recipes.map((recipe) => (
                <div key={recipe.id} className='carousel-slide'>
                    <RecipeCard recipe={recipe}
                        showTrashInsteadOfHeart={showTrashInsteadOfHeart} />
                </div>
            ))}
        </Slider>
    );
}
