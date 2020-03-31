let users = {
    1: {
      id: '1',
      username: 'Joe West',
      age: 30,
      hobbies: {
        default: 'Coding',
        fav: 'Running',
        fav2: 'Dancing',
      },
      messageIds: [1],
    },
    2: {
      id: '2',
      username: 'Pascal',
      age: 60,
      hobbies: {
        default: 'Coding',
        fav: 'Running',
        fav2: 'Dancing',
      },
      messageIds: [2],
    },
  };
  
  let messages = {
    1: {
      id: '1',
      text: 'Hello World',
      userId: '1',
    },
    2: {
      id: '2',
      text: 'By World',
      userId: '2',
    },
  };

  export default {
      users,
      messages,
  }