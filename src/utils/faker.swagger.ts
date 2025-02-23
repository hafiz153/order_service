import { faker } from '@faker-js/faker';

export function generateRegisterUser() {
  return {
    name: faker.person.fullName(),
    image: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    age: faker.number.int({ min: 18, max: 60 }),
  };
}

