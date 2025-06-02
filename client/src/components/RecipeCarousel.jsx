import Slider from "react-slick";
import RecipeCard from "./RecipeCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function RecipeCarousel({ recipes, showTrashInsteadOfHeart }) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(3, recipes.length),
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(2, recipes.length) },
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
        <div key={recipe.id} className="carousel-slide">
          <RecipeCard
            recipe={recipe}
            showTrashInsteadOfHeart={showTrashInsteadOfHeart}
          />
        </div>
      ))}
    </Slider>
  );
}
