import CategoriesCard from "@/app/components/organisms/flex-carousel/cards/CategoriesCard";
import TestimonialsDesktopCard from "@/app/components/organisms/flex-carousel/cards/ClassicCard";
import ClasicCard from "@/app/components/organisms/flex-carousel/cards/ClassicCard";
import ImagesCard from "@/app/components/organisms/flex-carousel/cards/ImageCard";
import PostsCard from "@/app/components/organisms/flex-carousel/cards/PostsCard";
import PostsDesktopCard from "@/app/components/organisms/flex-carousel/cards/PostsDesktopCard";
import TestimonialsCard from "@/app/components/organisms/flex-carousel/cards/TestimonialsCard";

// Configure our tabs and tab content here
const CardsIndex = [
  {
    id: "classic",
    content: ClasicCard,
  },
  {
    id: "image",
    content: ImagesCard,
  },
  {
    id: "testimonial",
    content: TestimonialsCard,
  },
  {
    id: "testimonialDesktop",
    content: TestimonialsDesktopCard,
  },
  {
    id: "category",
    content: CategoriesCard,
  },
  {
    id: "post",
    content: PostsCard,
  },
  {
    id: "postDesktop",
    content: PostsDesktopCard,
  },
];

export default CardsIndex;
