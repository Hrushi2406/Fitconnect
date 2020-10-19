import { attachDirectiveResolvers } from "apollo-server";
import faker from "faker";
import { Trainer, ITrainer } from "../../domain/entities/trainer";
import { IDGenerator } from "../core/id_generator";
import driver from "./db_config";
import { Plan } from "../../domain/entities/plans";

export async function seedTrainer(): Promise<void> {
  const session = driver.session();

  const createCategory = `CREATE (n:Category {name: $name }) `;

  const categories = ["Workout", "Yoga", "Zumba", "Meditation"];

  await session.run(createCategory, { name: categories[0] });
  await session.run(createCategory, { name: categories[1] });
  await session.run(createCategory, { name: categories[2] });
  await session.run(createCategory, { name: categories[3] });

  console.log("CREATED CATEGORY");

  for (let index = 0; index < 100; index++) {
    //Creaeteing trainer
    const trainer = createTrainer();

    const query: string = `CREATE (t:Trainer {
        trainerId:$trainerId,
        email:$email,
        name:$name,
        age:$age,
        gender:$gender,
        address:$address,
        bio:$bio,
        category:$category,
        profession:$profession,
        mobile:$mobile,
        images:$images,
        fcRating:$fcRating
   }) `;

    //ADDIING Trainer
    await session.run(query, trainer);

    console.log(index, " TRAINERS CREATED");

    //CATEGORY
    const category = `MATCH (t:Trainer), (c:Category) WHERE t.trainerId=$trainerId AND c.name=$name CREATE (t)-[:OFTYPE]->(c)`;

    //CREATING RELATIONHIP WITH CATEGORY
    await session.run(category, {
      trainerId: trainer.trainerId,
      name: trainer.category,
    });

    console.log("T --> C RELATIONSHIP CREATED");

    //GEOMETRY

    const createGeometry = `CREATE (g:Geometry {geometryId: $geometryId, lat: toFloat($lat), lon: toFloat($lon), description: $description}) `;

    //creating geometry
    await session.run(createGeometry, trainer.geometry);

    console.log("GEOMETRY CREATED");

    let geometryId = trainer.geometry.geometryId;

    //RELATION WITH GEOMETRY
    const relation = `MATCH (t:Trainer), (g:Geometry) WHERE t.trainerId = $trainerId  AND g.geometryId = $geometryId CREATE (t)-[r:LIVES]->(g) RETURN type(r)`;

    const trainerId = trainer.trainerId;

    await session.run(relation, { trainerId, geometryId });

    console.log("T --> G RELATION CREATED");

    var random = Math.floor(Math.random() * (6 - 3)) + 3;

    console.log("CREATING " + random + " PLANS");

    var minimum: number = 99999;

    //CREATING AND ADDING PLANS
    for (let i = 0; i < random; i++) {
      //create a plan
      var plan = createPlan();

      if(minimum > plan.price){
        minimum = plan.price 
      }

      //query
      const planQ = `CREATE (p:Plan {planId: $planId, title: $title, price:$price, type: $type}) `;

      await session.run(planQ, plan);

      console.log(i, " PLANS CREATED");

      //CREATING RELATIONHIP WITH PLANS

      const planTrainerR = `MATCH(t:Trainer),(p:Plan) WHERE t.trainerId=$trainerId AND p.planId=$planId CREATE (t)-[:HAS]->(p)`;

      await session.run(planTrainerR, {
        trainerId: trainer.trainerId,
        planId: plan.planId,
      });

      console.log("T -- P RELATIONSHIP CREATED");
    }
    //MIN COST PLAN
    const mCost = `MATCH (t:Trainer{ trainerId:$trainerId} ) SET t.startPrice=$startPrice RETURN t.startPrice`;

    //ASSIGN MIN COST
    await session.run(mCost, {
      trainerId: trainer.trainerId,
      startPrice: minimum,
    });

    console.log("ASSIGNED MIN COST OF PLAN");
  }
  //CREATE INDEX QUERY
  const index = "CALL db.index.fulltext.createNodeIndex('trainer_index', ['Trainer'], ['name', 'address', 'bio', 'category'])";

  //CREATE INDEX
  await session.run(index);

  console.log("CREATED INDEX ON TRAINER");

  console.log("SEEDED DATABASE SUCCESSFULLY");

  session.close();
}

function createPlan(): Plan {
  const type = ["Weekly", "Monthly", "Daily"];

  const plans = new Plan({
    planId: new IDGenerator().generate(),
    price: Math.floor(Math.random() * (8000 - 800)) + 800,
    title: faker.random.words(3),
    type: type[Math.floor(Math.random() * type.length)],
  });

  return plans;
}

function createTrainer(): Trainer {
  const gender = ["Male", "Female"];
  const categories = ["Workout", "Yoga", "Zumba", "Meditation"];

  const trainer = new Trainer({
    trainerId: new IDGenerator().generate(),
    email: faker.internet.email(),
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
    category: categories[Math.floor(Math.random() * categories.length)],
    profession: faker.name.jobTitle(),
    mobile: faker.phone.phoneNumber(),
    images: [faker.image.people()],
    fcRating: Math.floor(Math.random() * (99 - 60)) + 60,
    startPrice: 1000000,
    geometry: {
      geometryId: new IDGenerator().generate(),
      lat: parseFloat(
        faker.address.latitude(19.04345827558254, 18.940387062668094)
      ),
      lon: parseFloat(
        faker.address.longitude(72.88141250610352, 72.79309272766113)
      ),
      description: faker.address.streetName(),
    },
  });

  return trainer;
}

// export async function seedTrainer(): Promise<void> {
//   const gender = ["Male", "Female"];
//   const categories = ["Workout", "Yoga", "Zumba", "Meditation"];

//   const trainer = new Trainer({
//     trainerId: new IDGenerator().generate(),
//     email: faker.internet.email(),
//     name: faker.name.firstName() + " " + faker.name.lastName(),
//     age: Math.floor(Math.random() * 60) + 1,
//     gender: gender[Math.floor(Math.random() * gender.length)],
//     address:
//       faker.address.streetAddress() +
//       " " +
//       faker.address.city() +
//       " " +
//       faker.address.country(),
//     bio: faker.lorem.paragraphs(),
//     category: categories[Math.floor(Math.random() * categories.length)],
//     profession: faker.name.jobTitle(),
//     mobile: faker.phone.phoneNumber(),
//     images: [faker.image.people()],
//     fcRating: Math.floor(Math.random() * (99 - 60)) + 60,
//     geometry: {
//       geometryId: new IDGenerator().generate(),
//       lat: parseFloat(
//         faker.address.latitude(19.04345827558254, 18.940387062668094)
//       ),
//       lon: parseFloat(
//         faker.address.longitude(72.88141250610352, 72.79309272766113)
//       ),
//       description: faker.address.streetName(),
//     },
//   });

//   const type = ["Weekly", "Monthly", "Daily"];

//   const plans = new Plan({
//     planId: new IDGenerator().generate(),
//     price: Math.floor(Math.random() * (8000 - 800)) + 800,
//     title: faker.random.words(5),
//     type: type[Math.floor(Math.random() * type.length)],
//   });

//   console.log(plans);
// }

// seedTrainer();
