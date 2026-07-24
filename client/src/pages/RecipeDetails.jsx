import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import Navbar from "../components/Navbar";

const Page = styled.div`
  min-height: 100vh;
  background-color: #fffaf5;
`;

const Content = styled.main`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 56px 32px;

  @media (max-width: 600px) {
    padding: 40px 20px;
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 28px;
  color: #7a3e2d;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const RecipeLayout = styled.article`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  overflow: hidden;
  background-color: #ffffff;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(75, 46, 36, 0.12);

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  min-height: 500px;
  object-fit: cover;

  @media (max-width: 850px) {
    height: 360px;
    min-height: 0;
  }

  @media (max-width: 520px) {
    height: 260px;
  }
`;

const Details = styled.div`
  padding: 40px;

  @media (max-width: 520px) {
    padding: 28px 22px;
  }
`;

const SecretBadge = styled.span`
  display: inline-block;
  margin-bottom: 14px;
  padding: 7px 12px;
  border-radius: 999px;
  background-color: #f7eee7;
  color: #7a3e2d;
  font-size: 0.9rem;
  font-weight: 700;
`;

const Title = styled.h1`
  margin: 0 0 14px;
  color: #4b2e24;
  font-size: clamp(2.2rem, 5vw, 3.6rem);
`;

const Description = styled.p`
  margin: 0 0 28px;
  color: #725448;
  font-size: 1.08rem;
  line-height: 1.7;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 32px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const MetaItem = styled.div`
  padding: 14px;
  background-color: #fffaf5;
  border: 1px solid #eadfd6;
  border-radius: 10px;
`;

const MetaLabel = styled.span`
  display: block;
  margin-bottom: 4px;
  color: #8a6b5d;
  font-size: 0.85rem;
`;

const MetaValue = styled.strong`
  color: #4b2e24;
`;

const Section = styled.section`
  margin-top: 28px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 12px;
  color: #4b2e24;
  font-size: 1.35rem;
`;

const SectionText = styled.p`
  margin: 0;
  white-space: pre-line;
  color: #725448;
  line-height: 1.8;
`;

const Message = styled.p`
  padding: 64px 20px;
  text-align: center;
  color: #725448;
  font-size: 1.1rem;
`;

function RecipeDetails() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRecipe() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const config = token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {};

        const response = await axios.get(
          `http://localhost:3001/api/recipes/${id}`,
          config
        );

        setRecipe(response.data);
      } catch (requestError) {
        console.error("RECIPE DETAILS ERROR:", requestError);

        setError(
          requestError.response?.data?.message ||
            "Failed to load recipe details."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);

  return (
    <Page>
      <Navbar />

      <Content>
        <BackLink to="/recipes">← Back to recipes</BackLink>

        {loading && <Message>Loading recipe...</Message>}

        {error && <Message>{error}</Message>}

        {!loading && !error && recipe && (
          <RecipeLayout>
            <Image src={recipe.imageUrl} alt={recipe.name} />

            <Details>
              {recipe.isSecret && (
                <SecretBadge>🔒 Secret Recipe</SecretBadge>
              )}

              <Title>{recipe.name}</Title>

              <Description>{recipe.description}</Description>

              <MetaGrid>
                <MetaItem>
                  <MetaLabel>Preparation time</MetaLabel>
                  <MetaValue>{recipe.prepTime} minutes</MetaValue>
                </MetaItem>

                <MetaItem>
                  <MetaLabel>Servings</MetaLabel>
                  <MetaValue>{recipe.servings}</MetaValue>
                </MetaItem>

                <MetaItem>
                  <MetaLabel>Category</MetaLabel>
                  <MetaValue>
                    {recipe.category.replace("_", " ")}
                  </MetaValue>
                </MetaItem>

                <MetaItem>
                  <MetaLabel>Rating</MetaLabel>
                  <MetaValue>⭐ {recipe.rating}/5</MetaValue>
                </MetaItem>

                <MetaItem>
                  <MetaLabel>Cuisine</MetaLabel>
                  <MetaValue>{recipe.cuisine?.name}</MetaValue>
                </MetaItem>

                <MetaItem>
                  <MetaLabel>Country</MetaLabel>
                  <MetaValue>{recipe.cuisine?.country}</MetaValue>
                </MetaItem>
              </MetaGrid>

              <Section>
                <SectionTitle>Ingredients</SectionTitle>
                <SectionText>{recipe.ingredients}</SectionText>
              </Section>

              <Section>
                <SectionTitle>Instructions</SectionTitle>
                <SectionText>{recipe.instructions}</SectionText>
              </Section>
            </Details>
          </RecipeLayout>
        )}
      </Content>
    </Page>
  );
}

export default RecipeDetails;