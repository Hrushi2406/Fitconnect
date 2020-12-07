const puppeteer = require('puppeteer');
import faker from "faker";
import User from "../../domain/entities/user";
import { Encrypter } from "../../infrastructure/security/encrypter";
import { IDGenerator } from "../core/id_generator";
import driver from "./db_config";
import { UserRepository } from "../../data_provider/repository/user_repository";

export async function seedUser(): Promise<void> {
  const Imgs = await scrapeImages("https://www.gettyimages.in/photos/happy-person?family=creative&license=rf&phrase=happy%20person&sort=mostpopular#license");

  const session = driver.session();
  const userRepository = new UserRepository(driver);
  const categories = ["Workout", "Yoga", "Zumba", "Meditation"];

  for (let index = 0; index < 60; index++) {
    //Creaeteing trainer
    const user = await createUser(Imgs, index);

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

async function createUser(Imgs: any, index: number): Promise<User> {
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
    imageUrl: Imgs[index],
    lat: parseFloat(
      faker.address.latitude(18.983263072583924, 19.010937241263996)
    ),
    lon: parseFloat(
      faker.address.longitude(73.10776920822252, 73.1290895428582)
    ),
  });

  return user;
}

async function scrapeImages(url : string): Promise<any> {
  let browser = await puppeteer.launch({
      headless: true,
      args: ["--disable-setuid-sandbox"],
      'ignoreHTTPSErrors': true
  });

  const page = await browser.newPage();
  page.goto(url);
  await page.setViewport({
      width: 1000,
      height: 800
  });

  await page.waitForSelector('.search-content__gallery');

  try {
      const imgUrl = await page.$$eval(
          '.search-content__gallery .gallery-mosaic-asset__figure img', 
          (imgs : any) => imgs.map((img: any) => img.src)
      );
      console.log('Scrapped User Images');
      
      return imgUrl;
  } catch (err) {
      console.log("Went wrong", err);
  }

}
