<script lang="ts">
	import { page } from "$app/state";
</script>

<header>
	<div class="logo">
		<a href="/">NextStep</a>
	</div>

	<nav>
		<ul>
			<li aria-current={page.url.pathname === "/" ? "page" : undefined}>
				<a href="/">Home</a>
			</li>
			<li
				aria-current={page.url.pathname === "/jobs"
					? "page"
					: undefined}
			>
				<a href="/jobs">Jobs</a>
			</li>
			<li
				aria-current={page.url.pathname === "/dashboard"
					? "page"
					: undefined}
			>
				<a href="/dashboard">Dashboard</a>
			</li>
			<li
				aria-current={page.url.pathname === "/resume"
					? "page"
					: undefined}
			>
				<a href="/resume">Resume</a>
			</li>
			<li
				aria-current={page.url.pathname === "/auth/login"
					? "page"
					: undefined}
			>
				<a href="/auth/login">Login</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		background: white;
		border-bottom: 1px solid #e2e8f0;
	}

	.logo a {
		font-size: 1.5rem;
		font-weight: 700;
		color: #4f46e5;
		text-decoration: none;
	}

	nav ul {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 2rem;
	}

	nav a {
		color: #0f172a;
		text-decoration: none;
		font-weight: 500;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		transition: all 0.2s ease;
	}

	nav a:hover {
		background: #f1f5f9;
		color: #4f46e5;
	}

	li[aria-current="page"] a {
		background: #4f46e5;
		color: white;
	}

	@media (max-width: 768px) {
		header {
			padding: 1rem;
		}

		nav ul {
			gap: 1rem;
		}
	}
</style>
