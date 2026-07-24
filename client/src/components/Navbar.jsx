import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  width: 100%;
  padding: 18px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fffaf5;
  border-bottom: 1px solid #eadfd6;

  @media (max-width: 700px) {
    padding: 16px 20px;
    flex-direction: column;
    gap: 16px;
  }
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 1.6rem;
  color: #7a3e2d;
`;

const Links = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
`;

const StyledLink = styled(Link)`
  color: #4b2e24;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    color: #a85d43;
  }
`;

function Navbar() {
  return (
    <Nav>
      <Logo>Secret Kitchen</Logo>

      <Links>
        <StyledLink to="/">Home</StyledLink>
        <StyledLink to="/cuisines">Cuisines</StyledLink>
        <StyledLink to="/recipes">Recipes</StyledLink>
        <StyledLink to="/login">Login</StyledLink>
      </Links>
    </Nav>
  );
}

export default Navbar;