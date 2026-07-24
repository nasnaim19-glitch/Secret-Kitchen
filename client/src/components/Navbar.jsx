import styled from "styled-components";

const Nav = styled.nav`
  width: 100%;
  padding: 18px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fffaf5;
  border-bottom: 1px solid #eadfd6;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 1.6rem;
  color: #7a3e2d;
`;

const Links = styled.div`
  display: flex;
  gap: 24px;
`;

const NavLink = styled.a`
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
        <NavLink href="/">Home</NavLink>
        <NavLink href="#cuisines">Cuisines</NavLink>
        <NavLink href="#recipes">Recipes</NavLink>
        <NavLink href="/login">Login</NavLink>
      </Links>
    </Nav>
  );
}

export default Navbar;