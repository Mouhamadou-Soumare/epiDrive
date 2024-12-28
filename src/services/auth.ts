interface User {
    username: string;
    password: string;
  }
  
  let users: User[] = []; // Simule une base de données
  
  export function registerUser(username: string, password: string): string {
    if (users.find(user => user.username === username)) {
      throw new Error('User already exists');
    }
    users.push({ username, password });
    return 'User registered successfully';
  }
  
  export function loginUser(username: string, password: string): string {
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
      throw new Error('Invalid username or password');
    }
    return 'Login successful';
  }
  
  // Ajoutez cette fonction pour réinitialiser la "base de données"
  export function resetUsers(): void {
    users = [];
  }
  