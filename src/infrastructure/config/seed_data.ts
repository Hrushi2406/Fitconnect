const puppeteer = require("puppeteer");
import faker from "faker";
import { Trainer, ITrainer } from "../../domain/entities/trainer";
import { IDGenerator } from "../core/id_generator";
import driver from "./db_config";
import { Plan } from "../../domain/entities/plans";

export async function seedTrainer(): Promise<void> {
  // const Imgs = await scrapeImages(
  //   "https://www.gettyimages.in/photos/fitness-instructor?mediatype=photography&phrase=fitness%20instructor&sort=mostpopular"
  // );

  const Imgs = [
    "https://media.gettyimages.com/photos/stretching-in-the-gym-with-a-personal-trainer-picture-id1040504314?k=6&m=1040504314&s=612x612&w=0&h=xQe_eFh1cgxzPLg0yA3WUneK00iza21EfpFF4R9OfyY=",
    "https://media.gettyimages.com/photos/young-woman-doing-stretching-exercise-picture-id925395994?k=6&m=925395994&s=612x612&w=0&h=u8hrs7y1bVzwm4rp6-UBC3YwVSrSbOx8OvO-lDkqCUw=",
    "https://media.gettyimages.com/photos/come-on-one-more-pushup-picture-id1138386337?k=6&m=1138386337&s=612x612&w=0&h=LeWhi4gKpMBYmFflbrweAwKLoy2XLC6yJEytfFVq1Ys=",
    "https://media.gettyimages.com/photos/adult-woman-exercising-at-the-gym-with-a-personal-trainer-picture-id852401728?k=6&m=852401728&s=612x612&w=0&h=I898RH_z7xgce163qmhmHVnh3GCANN7Yp4yjCb1nXI4=",
    "https://media.gettyimages.com/photos/happy-senior-woman-having-fun-with-her-coach-on-exercising-class-in-a-picture-id909428568?k=6&m=909428568&s=612x612&w=0&h=AAIcHOJwOfZHG-Z3TRmt1WLSqzp6GCsQMhGHFnOjxGA=",
    "https://media.gettyimages.com/photos/fitness-trainer-at-gym-picture-id1072395722?k=6&m=1072395722&s=612x612&w=0&h=SEymEzcNs1YqbLDwEDzZtFLXLyTzBxfiOBVoniNoKuM=",
    "https://media.gettyimages.com/photos/female-fitness-instructor-going-thru-written-training-program-with-picture-id1067723968?k=6&m=1067723968&s=612x612&w=0&h=sstzeeTZBtPQZ1qN1ZarFisDblt001SlQBcvehgvN7k=",
    "https://media.gettyimages.com/photos/fitness-instructor-guiding-young-woman-when-she-exercises-picture-id1137413164?k=6&m=1137413164&s=612x612&w=0&h=_1ReBrtgs3EzsYSxCI7P8B4kpuMN3QGguUdLIoVFEUc=",
    "https://media.gettyimages.com/photos/happy-personal-trainer-working-at-the-gym-picture-id852401732?k=6&m=852401732&s=612x612&w=0&h=WTwWXkG-GMshYAHmdEeROWNDa6ABmHR3uZvNadC4A0g=",
    "https://media.gettyimages.com/photos/he-pushes-her-to-do-her-best-picture-id1051628014?k=6&m=1051628014&s=612x612&w=0&h=uQMuSAUTt8bqgP5MTtzSxFFn03WqABPUk0i7istBEu4=",
    "https://media.gettyimages.com/photos/sporty-woman-doing-pushups-under-supervision-of-personal-trainer-picture-id881592358?k=6&m=881592358&s=612x612&w=0&h=THpevroTg4ojvMdJq5xnygUWq1YntuCYyik-nN313gM=",
    "https://media.gettyimages.com/photos/portrait-of-a-beautiful-woman-at-the-gym-picture-id856797530?k=6&m=856797530&s=612x612&w=0&h=_hDfYO_exuYj3jq157FAr_Al6dA-lCi7lLDtwKmFh48=",
    "https://media.gettyimages.com/photos/couple-of-fitness-models-doing-the-pushups-picture-id869062004?k=6&m=869062004&s=612x612&w=0&h=b1VX5SsFhkVU7BRT8VGsAD8Iz1dyyI-Ghd5vftI1184=",
    "https://media.gettyimages.com/photos/athletic-woman-doing-battlerope-exercise-with-personal-trainer-at-gym-picture-id982408624?k=6&m=982408624&s=612x612&w=0&h=vzhdt4irrJ0ZsHDNv1hYCHCI2aUakI81vttlljmH5cc=",
    "https://media.gettyimages.com/photos/personal-trainer-caring-woman-with-her-workout-picture-id531326798?k=6&m=531326798&s=612x612&w=0&h=z0mUrcw7ciqjiSVrbJmGAR3mSXKqEQGhzO1UlDkS5oc=",
    "https://media.gettyimages.com/photos/young-fitness-instructor-reading-a-training-plan-in-a-gym-picture-id942145636?k=6&m=942145636&s=612x612&w=0&h=Ei5D_WMX6lSGLTxmVTTtParfD0oEZSl8UrBMZWLV3E4=",
    "https://media.gettyimages.com/photos/portrait-of-chinese-personal-trainer-in-gym-picture-id1018043738?k=6&m=1018043738&s=612x612&w=0&h=8-9NE2oJ7PB2hDcFg_GJldbVfXcQSJZik20fAarHp8A=",
    "https://media.gettyimages.com/photos/personal-weight-training-in-the-gym-picture-id1084251084?k=6&m=1084251084&s=612x612&w=0&h=2DCX5vi4fUtp-ED9aAcLQI0GL12K46syoiKS6fNUtII=",
    "https://media.gettyimages.com/photos/male-athlete-sitting-on-exercise-mat-and-making-vlog-at-gym-picture-id1176295972?k=6&m=1176295972&s=612x612&w=0&h=ALhiG5S0__I8rnkIt4LXnU7tpdloPXKqMvlUwa_KcTA=",
    "https://media.gettyimages.com/photos/personal-trainer-guiding-woman-doing-barbell-squats-at-gym-picture-id616121640?k=6&m=616121640&s=612x612&w=0&h=Pn6P7WzNsh3fHJz5KAT7LULePxPtxNP3s5Y2FtrnmrA=",
    "https://media.gettyimages.com/photos/trainer-and-female-client-talking-in-gym-picture-id1144036339?k=6&m=1144036339&s=612x612&w=0&h=lH8xWPahsQIN9fNvLxLfONQFSufpPttel1pZjGDKLGs=",
    "https://media.gettyimages.com/photos/personal-trainer-helping-mature-woman-at-gym-picture-id1047643096?k=6&m=1047643096&s=612x612&w=0&h=DZlb1nz23B7NnIFlX2t7QYTCEACNfRawCm_F2wPmd64=",
    "https://media.gettyimages.com/photos/gym-workout-picture-id619274128?k=6&m=619274128&s=612x612&w=0&h=IYy5J172Mk3atM9lfVGPQrQkOsTJG_6opOxVWHg5IJ0=",
    "https://media.gettyimages.com/photos/woman-exercising-with-dumbbells-in-squat-position-picture-id897564884?k=6&m=897564884&s=612x612&w=0&h=y8AVfmb7HOyc_uSNpwIrUSnmbGgRGYSqdaJe4QUOr2s=",
    "https://media.gettyimages.com/photos/young-woman-doing-stretching-exercise-picture-id918949496?k=6&m=918949496&s=612x612&w=0&h=vosaEshGZAtxlEFKiiyxWifgTNibZm9Sdmbx7WMLpus=",
    "https://media.gettyimages.com/photos/personal-trainer-timing-his-client-in-a-plank-position-picture-id1015125722?k=6&m=1015125722&s=612x612&w=0&h=uMhmQL_uks_77YcWAWSM7h6W7NLole-hHQD0nSa2mgM=",
    "https://media.gettyimages.com/photos/fitness-people-working-out-with-battle-ropes-picture-id616122214?k=6&m=616122214&s=612x612&w=0&h=XvF8tzmQGsngmaNnvzbMw1D2qp2bc1g6lNKXGRP1KXM=",
    "https://media.gettyimages.com/photos/portrait-of-fitness-trainer-at-gym-picture-id948515214?k=6&m=948515214&s=612x612&w=0&h=GA8CEwUMOTNyK7sWghsv3o2Yu8tYOsy-igdoem_zKZc=",
    "https://media.gettyimages.com/photos/fitness-trainer-teaching-girl-weightlifting-picture-id1049932176?k=6&m=1049932176&s=612x612&w=0&h=tT6I7xcOLrtpS2UhG6YZwRNtpq5dEBKSU2Ke8K5Q8Tk=",
    "https://media.gettyimages.com/photos/personal-trainer-helping-senior-woman-at-gym-picture-id1047643090?k=6&m=1047643090&s=612x612&w=0&h=ipAaI6e66IUdWh8aazJ_aHlHfdTJzZMHCVcSTDBOhUE=",
    "https://media.gettyimages.com/photos/fitness-instructor-helping-late-teen-girl-during-exercise-picture-id943532644?k=6&m=943532644&s=612x612&w=0&h=gdarPO5W_v_oqPiUeWOwNdVK0HZ_f9jbhsZUCLsouks=",
    "https://media.gettyimages.com/photos/young-athletic-woman-having-weight-training-with-fitness-instructor-picture-id618194022?k=6&m=618194022&s=612x612&w=0&h=kn2Qt21lB7zJGIBsE01o1aV5l0ee0itvddb3Z8X83WU=",
    "https://media.gettyimages.com/photos/people-exercising-in-a-gym-with-medicine-balls-picture-id1145611494?k=6&m=1145611494&s=612x612&w=0&h=bdxgf9OUgYlMH6IAuV-dtZTseoHSWbaVyTt-kLu_3YQ=",
    "https://media.gettyimages.com/photos/fitness-and-technology-picture-id902286308?k=6&m=902286308&s=612x612&w=0&h=OaZGMUabHujqP-bPl37PGSr433XplOQpBNRCNjuxbns=",
    "https://media.gettyimages.com/photos/young-woman-and-fitness-instructor-on-cross-training-in-gym-picture-id638039998?k=6&m=638039998&s=612x612&w=0&h=GvQeFr9MEubbid33B4M35tyaJtHkr3JFAcoNVSQqH2U=",
    "https://media.gettyimages.com/photos/testing-their-endurence-picture-id654427364?k=6&m=654427364&s=612x612&w=0&h=l38DRu9H0fvh4Xbu-MwY9rwl2HP1sYVwYJ4kaBunoVg=",
    "https://media.gettyimages.com/photos/see-what-happens-when-you-dont-give-up-picture-id1175815366?k=6&m=1175815366&s=612x612&w=0&h=_WvcAzzJA_QUqk6x-zQiH7EuItyEvwmqtcMfUiOkEA0=",
    "https://media.gettyimages.com/photos/fitness-instructor-taking-a-class-picture-id904637630?k=6&m=904637630&s=612x612&w=0&h=vttfxmxMRWeA19UPrBb1wAIl_G46_aJnNZ3Bot80H5g=",
    "https://media.gettyimages.com/photos/helping-him-achieve-great-progress-picture-id682517288?k=6&m=682517288&s=612x612&w=0&h=4_ZRIW94HdH2RInayiD0t4oYullggBWGp-DDzjx1uvk=",
    "https://media.gettyimages.com/photos/workout-with-personal-trainer-on-rowing-machine-at-gym-picture-id897564406?k=6&m=897564406&s=612x612&w=0&h=Evws4iHRkPJLbI1cVKZZmUNDSDtxJqyEcb3AAyb7K7c=",
    "https://media.gettyimages.com/photos/keep-this-parallel-to-the-ground-picture-id844459504?k=6&m=844459504&s=612x612&w=0&h=Dfz3V1WCiLg9Y6p1xDbf1fqVe1tV8YDphzR2t4zx1oY=",
    "https://media.gettyimages.com/photos/woman-doing-arm-exercises-with-suspension-straps-at-gym-picture-id621372500?k=6&m=621372500&s=612x612&w=0&h=BXZtbFJ3zdnoUcCkujW8vx9njJgQhxrHfXetDrOS62w=",
    "https://media.gettyimages.com/photos/trainer-watching-woman-running-ladder-picture-id738777325?k=6&m=738777325&s=612x612&w=0&h=nqn8GT8IfhLJkxzLv0lI3iO5jMNc_PCKAFRJlktTbPg=",
    "https://media.gettyimages.com/photos/woman-lifting-barbell-while-personal-trainer-assisting-her-in-gy-picture-id576573040?k=6&m=576573040&s=612x612&w=0&h=S-J2h6aRu0ecoqMx4lkN3Bn_fm638I-3kNFLLlfn9Q4=",
    "https://media.gettyimages.com/photos/portrait-of-a-female-personal-trainer-in-the-gym-picture-id1040495528?k=6&m=1040495528&s=612x612&w=0&h=bpC1dFuS53OgQa5whIC0QcvTQPIJTpjjYEP_YVam28Y=",
    "https://media.gettyimages.com/photos/africanamerican-fitness-instructor-helping-senior-woman-picture-id1140884096?k=6&m=1140884096&s=612x612&w=0&h=uRrmxob0QhpjEu2KhdfB83FVI-sbJEeCnxKti0GlHvE=",
    "https://media.gettyimages.com/photos/woman-and-personal-trainer-making-exercise-plan-in-gym-picture-id1078991800?k=6&m=1078991800&s=612x612&w=0&h=34U7dkJXrkN6T7fBrcOwC5SmOrZcheRGcWnxWqUxb2M=",
    "https://media.gettyimages.com/photos/happy-fitness-instructor-with-training-plan-in-a-health-club-picture-id925188400?k=6&m=925188400&s=612x612&w=0&h=6QF2zJmF2bVr27EcgbzKQIRRDsb4X4pSLEEqGiAdipg=",
    "https://media.gettyimages.com/photos/personal-trainer-helping-woman-work-out-picture-id96240487?k=6&m=96240487&s=612x612&w=0&h=q_6Ajd-JOnrRJJlFLZVCVB6IikrUWQNKlD_03AUrXxg=",
    "https://media.gettyimages.com/photos/personal-trainer-coaching-a-female-athlete-while-lifting-weights-picture-id816802320?k=6&m=816802320&s=612x612&w=0&h=F8hj9QxwlW899mddAlmZKQXSqS8bFIO9K0j-TE0hr1E=",
    "https://media.gettyimages.com/photos/little-help-from-her-trainer-picture-id530761466?k=6&m=530761466&s=612x612&w=0&h=zk2EPhjwR6aWf_f-gwKZnzTYzCjwFoIEPv4-C-x1Cbo=",
    "https://media.gettyimages.com/photos/workout-in-gym-after-pandemic-picture-id1227597612?k=6&m=1227597612&s=612x612&w=0&h=YxDyYJH7PSEycqOFPC2ewon79vR_csvGHXuXHu5laHs=",
    "https://media.gettyimages.com/photos/portrait-of-a-personal-trainer-in-the-gym-picture-id1040501222?k=6&m=1040501222&s=612x612&w=0&h=Jicbgmi2gWC1cYMtm4j0V0wV196LbSwFHtvcpPo_Jp4=",
    "https://media.gettyimages.com/photos/mature-woman-running-on-treadmill-while-being-coached-by-personal-picture-id1159498003?k=6&m=1159498003&s=612x612&w=0&h=bTf99uYOL1kQCJF3YiIo56KEts8n1kxEVBLxfXX7b54=",
    "https://media.gettyimages.com/photos/helping-him-to-achieve-his-fitness-goals-picture-id1051627106?k=6&m=1051627106&s=612x612&w=0&h=Ughc_kgwQoKyPP1tDT_w-YHWF2Q1k2whvN2e9K0pYeI=",
    "https://media.gettyimages.com/photos/personal-trainer-with-man-on-rowing-machine-in-gymnasium-picture-id147205518?k=6&m=147205518&s=612x612&w=0&h=vfYqD-Epi2V-Qat7-XcVsAnk83W34RMBsJywi6WuvS4=",
    "https://media.gettyimages.com/photos/woman-with-her-trainer-working-out-in-gym-picture-id735893671?k=6&m=735893671&s=612x612&w=0&h=Z3PAr0EVnEDsjc-xztO_XgkgYEMVYtjO4Qa8qJSlsbU=",
    "https://media.gettyimages.com/photos/smiling-fitness-trainer-talking-to-young-woman-in-a-gym-picture-id544576336?k=6&m=544576336&s=612x612&w=0&h=xYWQ_v9bEb0oB5XAafiKCKXWzcsTo1pA69a-o6O8Ows=",
    "https://media.gettyimages.com/photos/senior-woman-exercising-at-the-gym-with-a-personal-trainer-picture-id1010884934?k=6&m=1010884934&s=612x612&w=0&h=Lh7F2agiBDD5EcKhoGci8elgvTqG5ob8tG9blR8MaQs=",
    "https://media.gettyimages.com/photos/woman-jumping-on-box-with-fitness-trainer-picture-id616121156?k=6&m=616121156&s=612x612&w=0&h=JtoFyWC-MQiYzMREZoe9Y7pgz0BKG8dqmBOR61zSrq8=",
  ];

  const session = driver.session();

  const createCategory = `CREATE (n:Category {name: $name }) `;

  const categories = ["Workout", "Yoga", "Zumba", "Meditation"];

  await session.run(createCategory, { name: categories[0] });
  await session.run(createCategory, { name: categories[1] });
  await session.run(createCategory, { name: categories[2] });
  await session.run(createCategory, { name: categories[3] });

  console.log("CREATED CATEGORY");

  for (let index = 0; index < 40; index++) {
    //Createing trainer
    const trainer = createTrainer(Imgs, index);

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
        fcRating:$fcRating,
        lat:$lat,
        lon:$lon
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

    var random = Math.floor(Math.random() * (6 - 3)) + 3;

    console.log("CREATING " + random + " PLANS");

    var minimum: number = 99999;

    //CREATING AND ADDING PLANS
    for (let i = 0; i < random; i++) {
      //create a plan
      var plan = createPlan();

      if (minimum > plan.price) {
        minimum = plan.price;
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
  const index =
    "CALL db.index.fulltext.createNodeIndex('trainer_index', ['Trainer'], ['name', 'address', 'bio', 'category'])";

  //CREATE INDEX
  // await session.run(index);

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

function createTrainer(Imgs: any, index: number): Trainer {
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
    images: [Imgs[index]],
    fcRating: Math.floor(Math.random() * (99 - 60)) + 60,
    startPrice: 1000000,
    lat: parseFloat(
      faker.address.latitude(18.983263072583924, 19.010937241263996)
    ),
    lon: parseFloat(
      faker.address.longitude(73.10776920822252, 73.1290895428582)
    ),
  });

  return trainer;
}

async function scrapeImages(url: string): Promise<any> {
  let browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-setuid-sandbox"],
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  page.goto(url);
  await page.setViewport({
    width: 1000,
    height: 800,
  });

  await page.waitForSelector(".search-content__gallery");

  try {
    const imgUrl = await page.$$eval(
      ".search-content__gallery .gallery-mosaic-asset__figure img",
      (imgs: any) => imgs.map((img: any) => img.src)
    );
    console.log("Scrapped Trainer Images");

    return imgUrl;
  } catch (err) {
    console.log("Went wrong", err);
  }
}
