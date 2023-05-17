const lblEscritorio = document.querySelector("h1");
const lblPendientes = document.querySelector("#lblPendientes");
const lblTicket = document.querySelector("small");
const divAlerta = document.querySelector(".alert");
const btnAtender = document.querySelector("button");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("El escritorio es obligatorio");
}

const escritorio = searchParams.get("escritorio");

lblEscritorio.innerText = escritorio;
divAlerta.style.display = "none";
const socket = io();

socket.on("connect", () => {
  btnAtender.disabled = false;
});

socket.on("ultimo-ticket", (ultimoTicket) => {});

socket.on("disconnect", () => {
  btnAtender.disabled = true;
});

socket.on("tickets-pendientes", (pendientes) => {
  if (pendientes === 0) {
    lblPendientes.style.display = "none";
  } else {
    lblPendientes.style.display = "";
    lblPendientes.innerText = pendientes;
  }
});

btnAtender.addEventListener("click", () => {
  socket.emit("atender-ticket", { escritorio }, ({ ok, msg, ticket }) => {
    if (!ok) {
      lblTicket.innerText = "Nadie";

      return (divAlerta.style.display = "");
    }

    lblTicket.innerText = `Ticket ` + ticket.numero;
  });
});
