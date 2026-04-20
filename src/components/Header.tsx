import { Link, NavLink, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { useUser } from "../contexts/UserContext";

const Header = () => {
  const { user } = useUser();
  const location = useLocation();
  const cartItems = useAppSelector((state) => state.cart.items);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const hideCartLink = location.pathname === "/";

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          My Store
        </Link>
        <div className="header-user">
          <span>{user?.email}</span>
        </div>
        <nav className="nav">
          <NavLink to="/" end>
            Store
          </NavLink>

          <NavLink to="/dashboard">Dashboard</NavLink>

          {!hideCartLink && <NavLink to="/cart">Cart ({cartCount})</NavLink>}
        </nav>
      </div>
    </header>
  );
};

export default Header;
