import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";

const Page = styled.div`
  min-height: 100vh;
  background-color: #fffaf5;
`;

const Hero = styled.section`
  position: relative;
  min-height: 380px;
  display: flex;
  align-items: flex-end;
  background-image:
    linear-gradient(rgba(47, 27, 20, 0.18), rgba(47, 27, 20, 0.78)),
    url(${({ $imageUrl }) => $imageUrl});
  background-position: center;
  background-size: cover;
`;

const HeroContent = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 64px 32px;
  color: white;

  @media (max-width: 600px) {
    padding: 48px 20px;
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 24px;
  color: white;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  margin: 0 0 12px;
  font-size: clamp(2.8rem, 6vw, 5rem);
`;

const Country = styled.p`
  margin: 0 0 14px;
  font-size: 1.3rem;
  font-weight: 700;
`;

const Description = styled.p`
  max-width: 760px;
  margin: 0;
  font-size: 1.08rem;
  line-height: 1.7;
`;

const Content = styled.main`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 64px 32px;

  @media (max-width: 600px) {
    padding: 48px 20px;
  }
`;

const SectionTitle = styled.h2`
  margin: 0 0 28px;
  text-align: center;
  color: #4b2e24;
  font-size: 2rem;
`;

const LoginNotice = styled.div`
  max-width: 900px;
  margin: 0 auto 36px;
  padding: 18px 20px;
  text-align: center;
  background-color: #f7eee7;
  border: 1px solid #eadfd6;
  border-radius: 10px;
  color: #725448;
`;

const LoginLink = styled(Link)`
  color: #7a3e2d;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const CardsGrid = styled.div`
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
  padding: 64px 24px;
  text-align: center;
  color: #725448;
  font-size: 1.1rem;
`;

function CuisineDetails() {
  const { id } = useParams();

  const [cuisine, setCuisine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    async function fetchCuisine() {
      try {
        setLoading(true);
        setError("");

        const config = token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {};

        const response = await axios.get(
          `http://localhost:3001/api/cuisines/${id}`,
          config
        );

        setCuisine(response.data);
      } catch (requestError) {
        console.error("CUISINE DETAILS ERROR:", requestError);

        setError(
          requestError.response?.data?.message ||
            "Failed to load cuisine details."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCuisine();
  }, [id, token]);

  return (
    <Page>
      <Navbar />

      {loading && <Message>Loading cuisine...</Message>}

      {error && <Message>{error}</Message>}

      {!loading && !error && cuisine && (
        <>
          <Hero $imageUrl={cuisine.imageUrl}>
            <HeroContent>
              <BackLink to="/cuisines">← Back to cuisines</BackLink>

              <Title>{cuisine.name}</Title>
              <Country>{cuisine.country}</Country>
              <Description>{cuisine.description}</Description>
            </HeroContent>
          </Hero>

          <Content>
            <SectionTitle>{cuisine.name} Recipes</SectionTitle>

            {!isLoggedIn && (
              <LoginNotice>
                You are viewing public recipes.{" "}
                <LoginLink to="/login">Log in</LoginLink> to unlock the secret
                recipes.
              </LoginNotice>
            )}

            {cuisine.recipes.length === 0 ? (
              <Message>No recipes were found for this cuisine.</Message>
            ) : (
              <CardsGrid>
                {cuisine.recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </CardsGrid>
            )}
          </Content>
        </>
      )}
    </Page>
  );
}

export default CuisineDetails;