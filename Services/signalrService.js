import * as signalR from "@microsoft/signalr";

let connection = null;

export const startConnection = async () => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5244/gamehub")
    .withAutomaticReconnect() //default -> 0 2 10 30sn olmak üzere 4 kere yeninden bağlanmayı deneyecek
    .build();

  try {
    await connection.start();
    console.log("connection started");
  } catch (error) {
    console.log("bağlanırken bir hata oluştur", error);
  }
  return connection;
};

export const getConnection = () => connection;
