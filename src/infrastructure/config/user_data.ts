import { attachDirectiveResolvers } from "apollo-server";
import faker from "faker";
import User from "../../domain/entities/user";
import { Encrypter } from "../../infrastructure/security/encrypter"
import { IDGenerator } from "../core/id_generator";
import driver from "./db_config";
import { UserRepository } from "../../data_provider/repository/user_repository";

export async function seedUser(): Promise<void> {
  const session = driver.session();
  const userRepository = new UserRepository(driver);
  const categories = ["Workout", "Yoga", "Zumba", "Meditation"];

  for (let index = 0; index < 200; index++) {
    //Creaeteing trainer
    const user = await createUser();

    //ADDIING User
    await userRepository.registerUser(user);

    console.log(index, " USERS CREATED");

    //CATEGORY
    const randomcategory = categories[Math.floor(Math.random() * categories.length)]

    const category = `MATCH (u:User), (c:Category) WHERE u.user_id=$user_id AND c.name=$name CREATE (u)-[:OFTYPE]->(c)`;

    //CREATING RELATIONHIP WITH CATEGORY
    await session.run(category, {
      user_id: user.user_id,
      name: randomcategory,
    });

    console.log("U --> C RELATIONSHIP CREATED");
    
    }

    console.log("ADDED USERS SUCCESSFULLY");

    session.close();
}

async function createUser(): Promise<User> {
  const encrypter = new Encrypter();
  const gender = ["Male", "Female"];

  const user = new User({
    user_id: new IDGenerator().generate(),
    email: faker.internet.email(),
    password: await encrypter.encrypt('12345678'),
    name: faker.name.firstName() + " " + faker.name.lastName(),
    age: Math.floor(Math.random() * 60) + 1,
    gender: gender[Math.floor(Math.random() * gender.length)],
    address:
      faker.address.streetAddress() +
      " " +
      faker.address.city() +
      " " +
      faker.address.country(),
    bio: faker.lorem.paragraphs(),
    mobile: faker.phone.phoneNumber(),
    image_url: faker.image.people(),
  });

  return user;
}

