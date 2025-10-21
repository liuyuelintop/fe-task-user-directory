export interface User {
    id: string;
    email: string;
    name: {
      first: string;
      last: string;
      full: string;
    };
    picture: {
      large: string;
    };
    nationality: string;
  }