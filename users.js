const users = [];
const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  const exisitingUser = users.find(
    (user) => user.room === room && user.name === name
  );
  if (exisitingUser) {
    return {
      error: "This username is already taken,please use different username.",
    };
  }
  const user = { id, name, room };
  users.push(user);
  return { user };
};
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};
const getUser = (id) => {
  let temp = users.find((user) => user.id === id);
  return temp;
};
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
