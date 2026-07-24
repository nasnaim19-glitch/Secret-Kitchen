import styled from "styled-components";

const Card = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
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

const Country = styled.p`
  margin: 0;
  color: #666;
`;

function CuisineCard({ cuisine }) {
  return (
    <Card>
      <Image src={cuisine.imageUrl} alt={cuisine.name} />

      <Content>
        <Title>{cuisine.name}</Title>
        <Country>{cuisine.country}</Country>
      </Content>
    </Card>
  );
}

export default CuisineCard;