import { recipes as defaultRecipes } from "./data.js";

const STORAGE_KEY = "recipes_v1";

// Cargar recetas de localStorage o usar las predeterminadas
let recipes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultRecipes;

// Guardar las recetas iniciales si no existen en localStorage
if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRecipes));
}

const page = document.body.dataset.page;

if (page === "home") {
    initHome();
}

if (page === "detail") {
    initDetail();
}

if (page === "add-recipe") {
    initAddRecipe();
}

function initAddRecipe() {
    const form = document.getElementById("add-recipe-form");
    
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        const newRecipe = {
            id: formData.get("title").toLowerCase().replace(/\s+/g, "-"),
            title: formData.get("title"),
            description: formData.get("description"),
            time: formData.get("time"),
            difficulty: formData.get("difficulty"),
            servings: Number(formData.get("servings")),
            image: formData.get("image"),
            tags: formData.get("tags").split(",").map(t => t.trim()),
            ingredients: formData.get("ingredients").split("\n").filter(i => i.trim()),
            steps: formData.get("steps").split("\n").filter(s => s.trim()),
            accent: "#c8e6c9", // Default accent
            accentSoft: "#ecf7ed", // Default soft accent
            rating: 0,
            ratingCount: 0
        };

        recipes.push(newRecipe);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
        window.location.href = "/index.html";
    });
}

function initHome() {
	const grid = document.getElementById("recipe-grid");
	const emptyState = document.getElementById("empty-state");
	const searchInput = document.getElementById("search-input");
	const chips = document.querySelectorAll(".chip");

	renderCards(recipes, grid, emptyState);

	function handleFilter(term) {
		const query = term.trim().toLowerCase();
		const filtered = !query
			? recipes
			: recipes.filter((recipe) => matchesQuery(recipe, query));

		renderCards(filtered, grid, emptyState);
	}

	searchInput?.addEventListener("input", (event) => {
		handleFilter(event.target.value);
	});

	chips.forEach((chip) => {
		chip.addEventListener("click", () => {
			const term = chip.dataset.chip || chip.textContent || "";
			if (searchInput) {
				searchInput.value = term;
			}
			handleFilter(term);
		});
	});

	document.addEventListener("keydown", (event) => {
		if ((event.metaKey || event.ctrlKey) && event.key === "/") {
			event.preventDefault();
			searchInput?.focus();
		}
	});
}

function initDetail() {
	const params = new URLSearchParams(window.location.search);
	const id = params.get("id");
	const recipe = recipes.find((item) => item.id === id);

    const title = document.getElementById("recipe-title");
    const description = document.getElementById("recipe-description");
    const image = document.getElementById("recipe-image");
    const meta = document.getElementById("recipe-meta");
    const tags = document.getElementById("recipe-tags");
    const ingredients = document.getElementById("recipe-ingredients");
    const steps = document.getElementById("recipe-steps");

    if (!recipe) {
        if (title) title.textContent = "Receta no encontrada";
        if (description) {
            description.innerHTML = `No pudimos encontrar la receta con ID: <strong>${id}</strong>.<br>Vuelve al recetario para explorar otra opción.`;
        }
        return;
    }

    if (title) title.textContent = recipe.title;
    if (description) description.textContent = recipe.description;
    if (image) {
        image.src = recipe.image;
        image.alt = recipe.title;
    }

    if (meta) {
        renderRatingAndMeta(recipe, meta);
    }

	if (tags) {
		tags.innerHTML = "";
		recipe.tags.forEach((tag) => {
			const el = document.createElement("span");
			el.className = "tag";
			el.textContent = tag;
			tags.appendChild(el);
		});
	}

	if (ingredients) {
		ingredients.innerHTML = "";
		recipe.ingredients.forEach((item) => {
			const li = document.createElement("li");
			li.textContent = item;
			ingredients.appendChild(li);
		});
	}

	if (steps) {
		steps.innerHTML = "";
		recipe.steps.forEach((item) => {
			const li = document.createElement("li");
			li.textContent = item;
			steps.appendChild(li);
		});
	}
}

function renderCards(list, grid, emptyState) {
	if (!grid) return;
	grid.setAttribute("aria-busy", "true");
	grid.innerHTML = "";

	list.forEach((recipe) => {
		grid.appendChild(createCard(recipe));
	});

	if (emptyState) {
		emptyState.hidden = list.length !== 0;
	}

	grid.setAttribute("aria-busy", "false");
}

function renderRatingAndMeta(recipe, container) {
    container.innerHTML = "";
    
    // Rating Section
    const ratingSection = document.createElement("div");
    ratingSection.className = "rating-section";
    ratingSection.style.marginBottom = "12px";
    ratingSection.style.display = "flex";
    ratingSection.style.alignItems = "center";
    ratingSection.style.gap = "8px";
    
    const label = document.createElement("span");
    label.textContent = "Calificar:";
    label.style.fontWeight = "500";
    label.style.fontSize = "14px";
    
    const starsContainer = document.createElement("div");
    starsContainer.className = "star-rating";
    
    const updateStars = () => {
        starsContainer.innerHTML = "";
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement("span");
            star.className = `star ${i <= (recipe.rating || 0) ? "filled" : ""}`;
            star.textContent = "★";
            star.onclick = () => {
                recipe.rating = i;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
                updateStars();
            };
            starsContainer.appendChild(star);
        }
    };
    
    updateStars();
    
    ratingSection.appendChild(label);
    ratingSection.appendChild(starsContainer);
    container.appendChild(ratingSection);

    // Pills Section
    const pillsContainer = document.createElement("div");
    pillsContainer.className = "meta-pills";
    pillsContainer.style.display = "flex";
    pillsContainer.style.gap = "10px";
    pillsContainer.style.flexWrap = "wrap";

    [
        { label: "Tiempo", value: recipe.time },
        { label: "Dificultad", value: recipe.difficulty },
        { label: "Porciones", value: `${recipe.servings} pax` }
    ].forEach((item) => {
        const pill = document.createElement("span");
        pill.className = "pill";
        pill.textContent = `${item.label}: ${item.value}`;
        pillsContainer.appendChild(pill);
    });
    
    container.appendChild(pillsContainer);
}

function createStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += `<span class="star ${i <= rating ? "filled" : ""}">★</span>`;
    }
    return stars;
}

function createCard(recipe) {
    const card = document.createElement("a");
    card.className = "recipe-card";
    // Use absolute path to avoid relative path issues
    card.href = `/recipe.html?id=${encodeURIComponent(recipe.id)}`;
    card.style.setProperty("--card-soft", recipe.accentSoft);
    card.style.setProperty("--card-color", recipe.accent);
    card.setAttribute("aria-label", recipe.title);

    const imgWrapper = document.createElement("div");
    imgWrapper.className = "card-image-wrapper";
    const img = document.createElement("img");
    img.src = recipe.image;
    img.alt = recipe.title;
    img.loading = "lazy";
    imgWrapper.appendChild(img);

    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.appendChild(createPill(recipe.time));
    meta.appendChild(createPill(recipe.difficulty, true));

    const ratingDiv = document.createElement("div");
    ratingDiv.className = "card-rating";
    ratingDiv.innerHTML = `<span class="star filled">★</span> ${recipe.rating || 0}`;
    meta.appendChild(ratingDiv);

    const title = document.createElement("h3");
    title.textContent = recipe.title;

    const desc = document.createElement("p");
    desc.textContent = recipe.description;

    const tags = document.createElement("div");
    tags.className = "tags";
    recipe.tags.forEach((tag) => {
        const t = document.createElement("span");
        t.className = "tag";
        t.textContent = tag;
        tags.appendChild(t);
    });

    const link = document.createElement("span");
    link.className = "card-link";
    link.textContent = "Ver receta";

    card.appendChild(imgWrapper);
    card.appendChild(meta);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(tags);
    card.appendChild(link);

    return card;
}function createPill(text, subtle = false) {
	const el = document.createElement("span");
	el.className = subtle ? "pill subtle" : "pill";
	el.textContent = text;
	return el;
}

function matchesQuery(recipe, query) {
	return [
		recipe.title,
		recipe.description,
		recipe.tags.join(" "),
		recipe.ingredients.join(" ")
	]
		.join(" ")
		.toLowerCase()
		.includes(query);
}
