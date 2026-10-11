(() => {
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");

  function closeMenu() {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open navigation menu");
    menuBtn.querySelector("i").className = "ri-menu-line";
  }
  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    menuBtn.querySelector("i").className = isOpen ? "ri-close-line" : "ri-menu-line";
  });
  navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

  // Set the earliest selectable travel date to today.
  const dateInput = document.getElementById("travel-date");
  const localToday = new Date();
  dateInput.min = `${localToday.getFullYear()}-${String(localToday.getMonth()+1).padStart(2,"0")}-${String(localToday.getDate()).padStart(2,"0")}`;
  document.getElementById("year").textContent = new Date().getFullYear();

  // Tour cards and destination buttons preselect a destination in the booking form.
  document.querySelectorAll(".choose-tour").forEach(button => {
    button.addEventListener("click", () => {
      document.getElementById("booking-destination").value = button.dataset.destination;
      document.getElementById("booking").scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => document.querySelector('#booking-form [name="name"]').focus({ preventScroll: true }), 450);
    });
  });

  // "Show all" expands the holiday grid. Existing cards are retained and more are revealed.
  const extraDestinations = [
    {name:"Palawan", image:"palawan2.jpg", description:"Spectacular beaches, reefs, and limestone scenery."},
    {name:"Bohol", image:"bohol2.jpg", description:"Discover countryside views and island adventures."},
    {name:"Siargao", image:"siargao1.jpeg", description:"Slow down among palms, surf, and turquoise water."}
  ];
  const holidayGrid = document.getElementById("holiday-grid");
  const viewAll = document.getElementById("view-all");
  let expanded = false;
  extraDestinations.forEach(item => {
    const article = document.createElement("article");
    article.className = "holiday__card is-extra";
    article.hidden = true;
    article.innerHTML = `<img src="${item.image}" alt="${item.name}" loading="lazy"><div><h3>${item.name}</h3><p>${item.description}</p><button class="text-btn choose-tour" data-destination="${item.name}">Plan this trip <i class="ri-arrow-right-line"></i></button></div>`;
    holidayGrid.appendChild(article);
    article.querySelector(".choose-tour").addEventListener("click", () => {
      const select = document.getElementById("booking-destination");
      select.value = item.name;
      document.getElementById("booking").scrollIntoView({behavior:"smooth",block:"start"});
      window.setTimeout(() => document.querySelector('#booking-form [name="name"]').focus({preventScroll:true}), 450);
    });
  });
  viewAll.addEventListener("click", () => {
    expanded = !expanded;
    holidayGrid.querySelectorAll(".is-extra").forEach(card => card.hidden = !expanded);
    viewAll.textContent = expanded ? "Show fewer destinations" : "Show all destinations";
    viewAll.setAttribute("aria-expanded", String(expanded));
  });

  // This is a front-end demo: show a review of the request without pretending to submit it.
  document.getElementById("booking-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const result = document.getElementById("booking-result");
    const date = new Date(`${data.get("date")}T12:00:00`).toLocaleDateString(undefined, {year:"numeric",month:"long",day:"numeric"});
    result.textContent = `Thanks, ${data.get("name")}! Your request summary is ready.\n\nDestination: ${data.get("destination")}\nTravel date: ${date}\nTravelers: ${data.get("travelers")}\nContact email: ${data.get("email")}${data.get("message") ? `\nAdditional requests: ${data.get("message")}` : ""}\n\nThis is not a confirmed reservation. Please contact Tara Byahe directly to check availability, final pricing, and payment details.`;
    result.hidden = false;
    result.scrollIntoView({behavior:"smooth",block:"nearest"});
  });

  // Accessible image lightbox.
  const dialog = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const caption = document.getElementById("lightbox-caption");
  document.querySelectorAll(".gallery-item").forEach(button => {
    button.addEventListener("click", () => {
      lightboxImage.src = button.dataset.image;
      lightboxImage.alt = button.dataset.title;
      caption.textContent = button.dataset.title;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else window.open(button.dataset.image, "_blank", "noopener");
    });
  });
  document.getElementById("lightbox-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
})();