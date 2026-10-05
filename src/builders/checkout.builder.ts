import { faker } from '@faker-js/faker';
import { CheckoutInfo } from '@models';

export class CheckoutInfoBuilder {
  private info: CheckoutInfo;

  constructor() {
    this.info = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      postalCode: faker.location.zipCode(),
    };
  }

  withFirstName(firstName: string): this {
    this.info.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): this {
    this.info.lastName = lastName;
    return this;
  }

  withPostalCode(postalCode: string): this {
    this.info.postalCode = postalCode;
    return this;
  }

  build(): CheckoutInfo {
    return { ...this.info };
  }
}

export const aCheckoutInfo = (): CheckoutInfoBuilder => new CheckoutInfoBuilder();
