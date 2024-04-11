const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  
  fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status === 200) {
      window.location.replace("/products");
    }
  });
});

const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", () => {
  fetch("/api/sessions/logout", {
    method: "POST",
  })
  .then(response => {
    if (response.status === 200) {
      
      window.location.replace("/login");
    }
  })
  .catch(error => console.error("Error al cerrar sesión:", error));
});