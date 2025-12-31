import { useState } from "react";
import { Link } from "react-router-dom";
import MovieGrid from "../components/MovieGrid";
import "./Home.css";

export default function Home() {
	const [showDemo, setShowDemo] = useState(false);
	const demoMovies = [
		{ id: 1, title: "Demo Movie A", poster: "https://via.placeholder.com/300x450?text=Poster+A", year: 2024, rating: 8 },
		{ id: 2, title: "Demo Movie B", poster: "https://via.placeholder.com/300x450?text=Poster+B", year: 2023, rating: 7.5 },
		{ id: 3, title: "Demo Movie C", poster: "https://via.placeholder.com/300x450?text=Poster+C", year: 2022, rating: 7.9 },
	];

	return (
		<div className="home-container">
			<h1 className="home-title">🎬 MooNSine</h1>
			<p className="home-subtitle">Discover. Watch. Enjoy.</p>
			<div className="home-links">
				<Link to="/movies" className="btn btn-secondary">Browse Movies</Link>
				<Link to="/login" className="btn btn-primary">Login</Link>
				<Link to="/profile" className="btn btn-ghost">Profile</Link>
			</div>

			<div className="demo-controls">
				<button className="btn btn-secondary" onClick={() => setShowDemo((s) => !s)}>
					{showDemo ? "Hide Preview" : "Preview Movie Grid"}
				</button>
			</div>

			{showDemo && (
				<div className="demo-section">
					<MovieGrid movies={demoMovies} />
				</div>
			)}
		</div>
	);
}
