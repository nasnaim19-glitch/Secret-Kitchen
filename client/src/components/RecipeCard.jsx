import { Link } from "react-router-dom";
import styled from "styled-components";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 16px;
`;

const Title = styled.h3`
  margin: 0 0 8px;
  color: #2f1b14;
`;

const Description = styled.p`
  margin: 0 0 16px;
  color: #666;
  line-height: 1.5;
`;

const Rating = styled.span`
  margin-bottom: 18px;
  color: #d97706;
  font-weight: bold;
`;

const DetailsLink = styled(Link)`
  display: inline-block;
  margin-top: auto;
  padding: 11px 16px;
  border-radius: 8px;
  background-color: #7a3e2d;
  color: white;
  font-weight: 700;
  text-align: center;
  text-decoration: none;

  &:hover {
    background-color: #5f2f22;
  }
`;

function RecipeCard({ recipe }) {
  return (
    <Card>
      <Image src={recipe.imageUrl} alt={recipe.name} />

      <Content>
        <Title>{recipe.name}</Title>

        <Description>{recipe.description}</Description>

        <Rating>⭐ {recipe.rating}/5</Rating>

        <DetailsLink to={`/recipes/${recipe.id}`}>
          View Details
        </DetailsLink>
      </Content>
    </Card>
  );
}

export default RecipeCard;