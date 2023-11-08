const xhr = new XMLHttpRequest();

function updateTicket(id, name, description, status) {
  xhr.open('POST', 'http://localhost:7070/');

  const data = {
    method: 'updateTicket',
    data: {
      id, name, description, status,
    },
  };
  const dataJSON = JSON.stringify(data);

  xhr.send(dataJSON);
}

function deleteTicket(id) {
  xhr.open('GET', `http://localhost:7070/?method=deleteTicket&id=${id}`);
  xhr.send();
}

function addTicket(name, description) {
  xhr.open('POST', 'http://localhost:7070');

  const data = { method: 'addTicket', data: { name, description } };
  const dataJSON = JSON.stringify(data);

  xhr.send(dataJSON);
}

function getAllTicket() {
  xhr.open('GET', 'http://localhost:7070/?method=allTickets');
  xhr.send();
}

class Ticket {
  constructor(element, id, name, description, status, created) {
    this.element = element;
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.created = created;

    this.eventTicketName = this.eventTicketName.bind(this);
    this.eventTicketRedoButton = this.eventTicketRedoButton.bind(this);
    this.redoWindowCancelEvent = this.redoWindowCancelEvent.bind(this);
    this.redoWindowOKEvent = this.redoWindowOKEvent.bind(this);
    this.eventTicketDeleteButton = this.eventTicketDeleteButton.bind(this);
    this.deleteWindowCancelEvent = this.deleteWindowCancelEvent.bind(this);
    this.deleteWindowOkEvent = this.deleteWindowOkEvent.bind(this);
    this.eventticketCheckBox = this.eventticketCheckBox.bind(this);
  }

  get getHTML() {
    return `<div class="ticket-up">
              <input class="ticket-checkbox" type="checkbox" name="status"${this.status ? 'checked' : ''}>
              <div class="ticket-name">${this.name}</div>
              <div class="ticket-date">${this.created}</div>
              <div class="ticket-buttons">
                <button class="ticket-button ticket-button-redo">&#9998</button>
                <button class="ticket-button ticket-button-delete"'>X</button>
              </div>
            </div>
            <div class="ticket-down"></div>
           `;
  }

  get getHTMLredoTicket() {
    return `<div>Изменить тикет</div>
            <div>Краткое описание</div>
            <input class="redo-name" type="text" value="${this.name}"></input>
            <div>Подробное описание</div>
            <input class="redo-description" type="text" value="${this.description}"></input>
            <div>
              <button class="cancel-button">Отмена</button>
              <button class="ok-button">ОК</button>
            </div>`;
  }

  createRedoTicketWindow() {
    const redoWindow = document.createElement('div');
    redoWindow.classList.add('redo-window');
    redoWindow.innerHTML = this.getHTMLredoTicket;

    this.element.append(redoWindow);

    const cancelButton = redoWindow.querySelector('.cancel-button');
    cancelButton.addEventListener('click', this.redoWindowCancelEvent);

    const okButton = redoWindow.querySelector('.ok-button');
    okButton.addEventListener('click', this.redoWindowOKEvent);
  }

  redoWindowCancelEvent() {
    const redoWindows = this.element.querySelector('.redo-window');
    redoWindows.remove();
  }

  redoWindowOKEvent() {
    const redoWindows = this.element.querySelector('.redo-window');
    const redoName = redoWindows.querySelector('.redo-name');
    const redoDescription = redoWindows.querySelector('.redo-description');

    this.name = redoName.value;
    this.description = redoDescription.value;

    redoWindows.remove();
    updateTicket(this.id, this.name, this.description, this.status);
  }

  addTicket() {
    const ticketElement = document.createElement('div');
    ticketElement.classList.add('ticket');
    ticketElement.dataset.id = this.id;
    ticketElement.innerHTML = this.getHTML;
    this.element.append(ticketElement);

    const ticketCheckBox = ticketElement.querySelector('.ticket-checkbox');
    const ticketName = ticketElement.querySelector('.ticket-name');
    const ticketButtonRedo = ticketElement.querySelector('.ticket-button-redo');
    const ticketButtonDelete = ticketElement.querySelector('.ticket-button-delete');

    ticketName.addEventListener('click', this.eventTicketName);
    ticketButtonRedo.addEventListener('click', this.eventTicketRedoButton);
    ticketButtonDelete.addEventListener('click', this.eventTicketDeleteButton);
    ticketCheckBox.addEventListener('click', this.eventticketCheckBox);
  }

  eventticketCheckBox(e) {
    if (e.target.checked) {
      updateTicket(this.id, this.name, this.description, true);
    } else {
      updateTicket(this.id, this.name, this.description, false);
    }
  }

  eventTicketDeleteButton() {
    this.createDeleteTicketWindow();
  }

  createDeleteTicketWindow() {
    const deleteWindow = document.createElement('div');
    deleteWindow.classList.add('delete-windows');

    deleteWindow.innerHTML = `<div>Удалить тикет</div>
                              <div>Вы действительно хотите удалить тикет?</dv>
                              <div class="delete-windows-buttons">
                                <button class="delete-windows-cancel">Отмена</button>
                                <button class="delete-windows-ok">OK</button>
                              </div>`;

    this.element.append(deleteWindow);

    const deleteWindowCancelButton = deleteWindow.querySelector('.delete-windows-cancel');
    deleteWindowCancelButton.addEventListener('click', this.deleteWindowCancelEvent);

    const deleteWindowOkButton = deleteWindow.querySelector('.delete-windows-ok');
    deleteWindowOkButton.addEventListener('click', this.deleteWindowOkEvent);
  }

  deleteWindowCancelEvent() {
    const deleteWindow = this.element.querySelector('.delete-windows');
    deleteWindow.remove();
  }

  deleteWindowOkEvent() {
    const deleteWindow = this.element.querySelector('.delete-windows');

    deleteWindow.remove();

    deleteTicket(this.id);
  }

  eventTicketName() {
    const ticket = this.element.querySelector(`[data-id="${this.id}"]`);
    const ticketDown = ticket.querySelector('.ticket-down');

    if (ticketDown.textContent.trim() === '') {
      ticketDown.textContent = this.description;
    } else {
      ticketDown.textContent = '';
    }
  }

  eventTicketRedoButton() {
    this.createRedoTicketWindow();
  }
}

function drawTickets(ticketsData) {
  const tickets = document.querySelectorAll('.ticket');

  for (const ticket of tickets) {
    ticket.remove();
  }

  for (const ticketData of ticketsData) {
    const ticket = new Ticket(document.querySelector('.container'), ticketData.id, ticketData.name, ticketData.description, ticketData.status, ticketData.created);
    ticket.addTicket();
  }
}

function dataHandler(data) {
  const commands = ['allTickets', 'updateTicket', 'deleteTicket', 'addTicket'];
  console.log(data.data);
  if (commands.includes(data.comand)) {
    drawTickets(data.data);
  }
}

xhr.addEventListener('load', () => {
  if (xhr.status >= 200 && xhr.status < 300) {
    try {
      const data = JSON.parse(xhr.responseText);
      dataHandler(data);
    } catch (e) {
      console.error(e);
    }
  }
});

const addButton = document.createElement('button');
addButton.textContent = 'добавить тикет';
addButton.classList.add('add-button');
document.querySelector('.container').append(addButton);

addButton.addEventListener('click', () => {
  const addWindow = document.createElement('div');
  addWindow.classList.add('add-window');
  addWindow.innerHTML = ` <div>Добавить тикет</div>
                          <div>Краткое описание</div>
                          <input class="add-name" type="text"></input>
                          <div>Подробное описание</div>
                          <input class="add-description" type="text"></input>
                          <div>
                            <button class="add-cancel-button">Отмена</button>
                            <button class="add-ok-button">ОК</button>
                          </div>`;

  document.querySelector('.container').append(addWindow);

  const addWindowsCancelButton = addWindow.querySelector('.add-cancel-button');
  addWindowsCancelButton.addEventListener('click', () => {
    addWindow.remove();
  });

  const addWindowsOkButton = addWindow.querySelector('.add-ok-button');
  addWindowsOkButton.addEventListener('click', () => {
    const addName = addWindow.querySelector('.add-name');
    const addDescription = addWindow.querySelector('.add-description');

    addWindow.remove();

    addTicket(addName.value, addDescription.value);
  });
});

getAllTicket();
