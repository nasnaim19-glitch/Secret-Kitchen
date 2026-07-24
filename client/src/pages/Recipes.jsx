import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";

const Page = styled.div`
  min-height: 100vh;
  background-color: #fffaf5;
`;

const Header = styled.section`
  padding: 72px 32px 40px;
  text-align: center;
  background-color: #f7eee7;

  @media (max-width: 520px) {
    padding: 56px 20px 32px;
  }
`;

const Title = styled.h1`
  margin: 0 0 16px;
  font-size: clamp(2.4rem, 5vw, 4rem);
  color: #4b2e24;
`;

const Subtitle = styled.p`
  max-width: 760px;
  margin: 0 auto;
  font-size: 1.1rem;
  line-height: 1.7;
  color: #725448;
`;

const Content = styled.main`
  padding: 64px 32px;

  @media (max-width: 520px) {
    padding: 48px 20px;
  }
`;

const CardsGrid = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Message = styled.p`
  padding: 48px 24px;
  text-align: center;
  font-size: 1.1rem;
  color: #725448;
`;

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:3001/api/recipes"
        );

        setRecipes(response.data);
      } catch (requestError) {
        console.error("RECIPES ERROR:", requestError);
        setError("Failed to load recipes.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  return (
    <Page>
      <Navbar />

      <Header>
        <Title>Recipes</Title>

        <Subtitle>
          Explore delicious recipes from around the world and discover new
          dishes to cook.
        </Subtitle>
      </Header>

      <Content>
        {loading && <Message>Loading recipes...</Message>}

        {error && <Message>{error}</Message>}

        {!loading && !error && recipes.length === 0 && (
          <Message>No recipes were found.</Message>
        )}

        {!loading && !error && recipes.length > 0 && (
          <CardsGrid>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </CardsGrid>
        )}
      </Content>
    </Page>
  );
}

export default Recipes;