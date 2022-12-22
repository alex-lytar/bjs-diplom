"use strict"
const logoutButton = new LogoutButton();

logoutButton.action = () => ApiConnector.logout(
  (response) => {
    if (response.success) {
      location.reload()
    }
  }
);

ApiConnector.current((response) => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
}
)

const rates = new RatesBoard();
function ratesUpdate() {
  ApiConnector.getStocks(response => {
    if (response.success) {
      rates.clearTable();
      rates.fillTable(response.data);
      return;
    }
  });
}
setInterval(ratesUpdate(), 60000);

const pNt = new MoneyManager();
pNt.addMoneyCallback = credit => ApiConnector.addMoney(credit, response => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
    pNt.setMessage(true, 'Успешное пополнение счета на' + credit.currency + credit.amount);;
  } else {
    pNt.setMessage(false, 'Ошибка: ' + response.error);
  }
});

pNt.conversionMoneyCallback = exchange => ApiConnector.convertMoney(exchange, response => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
    pNt.setMessage(true, 'Успешная конвертация суммы ' + exchange.fromCurrency + exchange.fromAmount);
  } else {
    pNt.setMessage(false, 'Ошибка: ' + response.error);
  }
});

pNt.sendMoneyCallback = debit => ApiConnector.transferMoney(debit, response => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
    pNt.setMessage(true, 'Успешный перевод ' + debit.currency + debit.amount + ' получателю ' + debit.to);
  } else {
    pNt.setMessage(false, 'Ошибка: ' + response.error);
  }
});

const favorite = new FavoritesWidget();
ApiConnector.getFavorites(response => {
  if (response.success) {
    favorite.clearTable();
    favorite.fillTable(response.data);
    pNt.updateUsersList(response.data);
    return;
  }
});

favorite.addUserCallback = addUser => ApiConnector.addUserToFavorites(addUser, response => {
  if (response.success) {
    favorite.clearTable();
    favorite.fillTable(response.data);
    pNt.updateUsersList(response.data);
    pNt.setMessage(true, 'Добавлен новый пользователь #' + addUser.id + ': ' + addUser.name);
  } else {
    pNt.setMessage(false, 'Ошибка: ' + response.error);
  }
});

favorite.removeUserCallback = deletedUser => ApiConnector.removeUserFromFavorites(deletedUser, response => {
  if (response.success) {
    favorite.clearTable();
    favorite.fillTable(response.data);
    pNt.updateUsersList(response.data);
    pNt.setMessage(true, 'Пользователь ' + deletedUser + ' удален');
  } else {
    pNt.setMessage(false, 'Ошибка: ' + response.error);
  }
});