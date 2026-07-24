import styled from "styled-components";

const Card = styled.div`
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
  padding: 16px;
`;

const Title = styled.h3`
  margin: 0 0 8px;
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 12px;
`;

const Rating = styled.span`
  color: #d97706;
  font-weight: bold;
`;

function RecipeCard({ recipe }) {
  return (
    <Card>
      <Image src={recipe.imageUrl} alt={recipe.name} />

      <Content>
        <Title>{recipe.name}</Title>

        <Description>{recipe.description}</Description>

        <Rating>⭐ {recipe.rating}/5</Rating>
      </Content>
    </Card>
  );
}

export default RecipeCard;