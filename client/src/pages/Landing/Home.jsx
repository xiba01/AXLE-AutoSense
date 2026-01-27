import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to AXLE</h1>
      <Link to="/login" className="text-blue-600 underline">
        Go to Dealer Login
      </Link>
    </div>
  );
}
