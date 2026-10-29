"use strict";

function calculateTotal(price, quantity, discountFn) {
  const total = price * quantity;
  return typeof discountFn === "function" ? discountFn(total) : total;
}

function createDiscount(percent) {
  return (amount) => amount - (amount * percent) / 100;
}

function createTicketOffice(eventName, capacity) {
  let sold = 0;

  return function (name) {
    if (sold >= capacity) {
      return null;
    }
    sold += 1;
    return { event: eventName, number: sold, name: name };
  };
}

function print(ticket) {
  if (ticket === null) {
    console.log("Билеты закончились.");
    return;
  }

  console.log(
    `Билет №${ticket.number}:\n  Мероприятие: ${ticket.event}\n  Покупатель: ${ticket.name}`,
  );
}

function createOrganizer(name) {
  return {
    name: name,
    ticketToLine: function (ticket) {
      return `Организатор: ${this.name} | Билет №${ticket.number} | Мероприятие: ${ticket.event} | Имя: ${ticket.name}`;
    },
  };
}

const studentDiscount = createDiscount(20);
const noDiscount = createDiscount(0);
const freeDiscount = createDiscount(100);

console.log("= Расчёт стоимости =");
console.log(calculateTotal(1000, 2)); // 2000
console.log(calculateTotal(1000, 2, studentDiscount)); // 1600
console.log(calculateTotal(1000, 2, noDiscount)); // 2000
console.log(calculateTotal(1000, 2, freeDiscount)); // 0
console.log(calculateTotal(1000, 0, studentDiscount)); // 0

console.log("\n= Выдача билетов =");
const officeA = createTicketOffice("Frontend Meetup", 2);
const officeB = createTicketOffice("Backend Meetup", 1);
const emptyOffice = createTicketOffice("Пустая касса", 0);

const ticketA1 = officeA("Анна");
const ticketB1 = officeB("Иван");
const ticketA2 = officeA("Мария");
const ticketA3 = officeA("Пётр");
const emptyTicket = emptyOffice("Ольга");

console.log(ticketA1); // { event: 'Frontend Meetup', number: 1, name: 'Анна' }
console.log(ticketB1); // { event: 'Backend Meetup', number: 1, name: 'Иван' }
console.log(ticketA2); // { event: 'Frontend Meetup', number: 2, name: 'Мария' }
console.log(ticketA3); // null
console.log(emptyTicket); // null

console.log("\n= Печать билета =");
print(ticketA1);
print(ticketA1);
print(ticketA3);

console.log("\n= Дополнительно =");
const organizer = createOrganizer("ИТМО");
const unbound = organizer.ticketToLine;
try {
  console.log(unbound(ticketA1));
} catch (error) {
  console.log("Без bind:", error.message);
}
const bound = organizer.ticketToLine.bind(organizer);
console.log("С bind:", bound(ticketA1));
