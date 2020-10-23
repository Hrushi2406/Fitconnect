import { attachDirectiveResolvers } from "apollo-server";
import faker from "faker";
import User from "../../domain/entities/user";
import { Encrypter } from "../../infrastructure/security/encrypter";
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

    var n = Math.floor(Math.random() * categories.length) + 1;
    var randomCategory = categories.sort(() => 0.5 - Math.random()).slice(0, n);

    console.log(index, " USERS CREATED");

    //CATEGORY
    const randomcategory =
      categories[Math.floor(Math.random() * categories.length)];

    let query = "MATCH (u:User), (c:Category) WHERE u.userId=$userId AND";

    // randomCategory.map((c, i) => {
    //   let arr = query.split(" ");
    //   if (arr[arr.length - 1] == "AND") {
    //     query = query + " c.name='" + c + "'";
    //   } else {
    //     query = query + " OR c.name='" + c + "'";
    //   }
    // });

    for (let j = 0; j < randomCategory.length; j++) {
      const category = `MATCH (u:User), (c:Category) WHERE u.userId=$userId AND c.name=$name CREATE (u)-[:OFTYPE]->(c)`;
      //CREATING RELATIONHIP WITH CATEGORY
      await session.run(category, {
        userId: user.userId,
        name: randomCategory[j],
      });
    }

    // query = query + " CREATE (u)-[:OFTYPE]->(c)";

    console.log("U --> C RELATIONSHIP CREATED");
  }

  console.log("ADDED USERS SUCCESSFULLY");

  session.close();
}

async function createUser(): Promise<User> {
  const encrypter = new Encrypter();
  const gender = ["Male", "Female"];

  const user = new User({
    userId: new IDGenerator().generate(),
    email: faker.internet.email(),
    password: await encrypter.encrypt("12345678"),
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
    imageUrl: faker.image.people(),
    lat: parseFloat(
      faker.address.latitude(19.04345827558254, 18.940387062668094)
    ),
    lon: parseFloat(
      faker.address.longitude(72.88141250610352, 72.79309272766113)
    ),
  });

  return user;
}
