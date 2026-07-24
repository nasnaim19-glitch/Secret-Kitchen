import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

import Navbar from "../components/Navbar";
import CuisineCard from "../components/CuisineCard";
import RecipeCard from "../components/RecipeCard";

const Page = styled.div`
  min-height: 100vh;
  background-color: #fffaf5;
`;

const Hero = styled.section`
  min-height: 420px;
  padding: 64px 32px;
  display: flex;
  align-items: center;
  background-color: #f7eee7;

  @media (max-width: 768px) {
    padding: 48px 24px;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  max-width: 700px;
  margin: 0 0 24px;
  font-size: clamp(3rem, 6vw, 5.5rem);
  line-height: 1.05;
  color: #4b2e24;
`;

const HeroText = styled.p`
  max-width: 720px;
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.7;
  color: #725448;
`;

const Section = styled.section`
  padding: 64px 32px;

  @media (max-width: 520px) {
    padding: 48px 20px;
  }
`;

const SectionTitle = styled.h2`
  margin: 0 0 32px;
  text-align: center;
  font-size: 2.2rem;
  color: #4b2e24;
`;

const CardsGrid = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Message = styled.p`
  padding: 48px 24px;
  text-align: center;
  font-size: 1.1rem;
  color: #725448;
`;

function Home() {
  const [cuisines, setCuisines] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHomeData() {
      try {
        setLoading(true);
        setError("");

        const [cuisinesResponse, recipesResponse] = await Promise.all([
          axios.get("http://localhost:3001/api/cuisines"),
          axios.get("http://localhost:3001/api/recipes"),
        ]);

        setCuisines(cuisinesResponse.data);

        const publicRecipes = recipesResponse.data
          .filter((recipe) => !recipe.isSecret)
          .slice(0, 5);

        setRecipes(publicRecipes);
      } catch (requestError) {
        console.error("HOME DATA ERROR:", requestError);
        setError("Failed to load Secret Kitchen data.");
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  return (
    <Page>
      <Navbar />

      <Hero>
        <HeroContent>
          <HeroTitle>Welcome to Secret Kitchen</HeroTitle>

          <HeroText>
            Discover public recipes and explore cuisines from around the world.
            Log in later to unlock the secret recipes.
          </HeroText>
        </HeroContent>
      </Hero>

      {loading && <Message>Loading Secret Kitchen...</Message>}

      {error && <Message>{error}</Message>}

      {!loading && !error && (
        <>
          <Section id="cuisines">
            <SectionTitle>Explore Cuisines</SectionTitle>

            <CardsGrid>
              {cuisines.map((cuisine) => (
                <CuisineCard key={cuisine.id} cuisine={cuisine} />
              ))}
            </CardsGrid>
          </Section>

          <Section id="recipes">
            <SectionTitle>Featured Recipes</SectionTitle>

            <CardsGrid>
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </CardsGrid>
          </Section>
        </>
      )}
    </Page>
  );
}

export default Home;