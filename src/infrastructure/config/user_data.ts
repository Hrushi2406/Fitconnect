const puppeteer = require("puppeteer");
import faker from "faker";
import User from "../../domain/entities/user";
import { Encrypter } from "../../infrastructure/security/encrypter";
import { IDGenerator } from "../core/id_generator";
import driver from "./db_config";
import { UserRepository } from "../../data_provider/repository/user_repository";

export async function seedUser(): Promise<void> {
  // const Imgs = await scrapeImages("https://www.gettyimages.in/photos/happy-person?family=creative&license=rf&phrase=happy%20person&sort=mostpopular#license");
  const Imgs = [
    "https://media.gettyimages.com/photos/joyous-woman-infront-of-wall-picture-id981594838?k=6&m=981594838&s=612x612&w=0&h=L3Aq4sxRdLAqbQVmeT52d1nnqGyNu_qPHUjEPcUmoo8=",
    "https://media.gettyimages.com/photos/using-mobile-phone-picture-id1147785920?k=6&m=1147785920&s=612x612&w=0&h=ZhXW2w8LDfxRbRKK-3BXWIVl1UwHmiLrV-LPHww-ZF8=",
    "https://media.gettyimages.com/photos/enjoying-the-fresh-sea-air-picture-id468906855?k=6&m=468906855&s=612x612&w=0&h=dXLefVTpDhCoO7LMiNYKnl-k30swAywVO-iMqoc5wsk=",
    "https://media.gettyimages.com/photos/mature-man-playing-with-his-little-daughter-in-nature-picture-id1023147086?k=6&m=1023147086&s=612x612&w=0&h=2ut2H06i8kmAOemdB_BjQmz8ZLgIWK5QtTHxVS3Q2Mg=",
    "https://media.gettyimages.com/photos/portrait-of-happy-young-woman-enjoying-sunlight-picture-id1134454088?k=6&m=1134454088&s=612x612&w=0&h=pT4ynfqRPOn_5j46lqGc08UZJuFH4JtKm3X4WhBevuM=",
    "https://media.gettyimages.com/photos/the-suns-up-and-so-is-my-mood-picture-id911999972?k=6&m=911999972&s=612x612&w=0&h=dimamyIp4K_FgUZGEdHI3ZmGptgJPtm0vzfbxIQ7vM4=",
    "https://media.gettyimages.com/photos/nothing-inspires-happiness-like-love-picture-id1094338222?k=6&m=1094338222&s=612x612&w=0&h=Aa85rto1n0SamxoW1g2GQ9ctcdrKpGNNlbAwpt3muZg=",
    "https://media.gettyimages.com/photos/young-woman-with-dog-picture-id1060529042?k=6&m=1060529042&s=612x612&w=0&h=ofC5lNecobvOgQS_QtbWgY3gub_58t2EbcCJyRB9o9s=",
    "https://media.gettyimages.com/photos/laughing-young-woman-lying-on-a-bench-using-cell-phone-picture-id1139713930?k=6&m=1139713930&s=612x612&w=0&h=ofIQ2icxKQ0OEnlJY7-ajXvVQMvLnuE9uFXQf6MoBNg=",
    "https://media.gettyimages.com/photos/colourful-studio-portrait-of-a-young-man-picture-id1146910475?k=6&m=1146910475&s=612x612&w=0&h=8oe7NoRxvLBSy3uzc4XVdg8jFmJgMJoLSrbVh-8EJgk=",
    "https://media.gettyimages.com/photos/cracking-codes-is-my-speciality-picture-id993565470?k=6&m=993565470&s=612x612&w=0&h=SaitH0UWEIe7nTQImPXkoQVA4cgxVY2_sIAO42h-sfc=",
    "https://media.gettyimages.com/photos/working-hard-no-matter-the-time-picture-id912944158?k=6&m=912944158&s=612x612&w=0&h=B04Y7_2p5cbT06iBqr_Ka_ll1Jj_yKMxxF7IPHV_eh4=",
    "https://media.gettyimages.com/photos/smiling-businesswoman-at-work-picture-id1092806334?k=6&m=1092806334&s=612x612&w=0&h=QFciT2-ETPhrtXIdaSaBhMCK80qXkZ0gtBTvad_tQYw=",
    "https://media.gettyimages.com/photos/father-and-daughter-laughing-in-bedroom-picture-id1144518606?k=6&m=1144518606&s=612x612&w=0&h=D5R065nw0QzkSUCthGqC_CenuiBXUCfT9uQmIoRNynU=",
    "https://media.gettyimages.com/photos/active-senior-woman-making-a-heart-with-her-hands-picture-id1167841965?k=6&m=1167841965&s=612x612&w=0&h=XEh6IzWChr_g9yPiF9Yh21OeqLNqr8ckOmA4aPUDXVc=",
    "https://media.gettyimages.com/photos/proud-of-my-teams-achievements-picture-id1036148262?k=6&m=1036148262&s=612x612&w=0&h=AGcqZwVaob96a_GO5TV_dFswl_1qgJiq1Q2ZF0r-d_I=",
    "https://media.gettyimages.com/photos/connection-with-nature-picture-id1174472274?k=6&m=1174472274&s=612x612&w=0&h=x4PpIA9bO4Ao_KA3LqA2AK7ewfF2aOggiUORenjlBMg=",
    "https://media.gettyimages.com/photos/portrait-of-mature-woman-with-gray-hair-sitting-on-swing-picture-id986698776?k=6&m=986698776&s=612x612&w=0&h=Y1B-WL14Cs2X86Y448NJMowqhMDbSG3e158mcUqlyig=",
    "https://media.gettyimages.com/photos/home-office-picture-id1193214720?k=6&m=1193214720&s=612x612&w=0&h=PG-IQkhXnBoKPFgErSLEwbDuAztvfXJjAg83tSr1RGA=",
    "https://media.gettyimages.com/photos/succeeding-is-what-we-do-best-picture-id1140524579?k=6&m=1140524579&s=612x612&w=0&h=WLsjAp4MY6GclCeBZAPs53qekcgwbyHU8Qk0nhwqUxU=",
    "https://media.gettyimages.com/photos/young-woman-spending-a-relaxing-day-in-her-beautiful-home-picture-id1062517720?k=6&m=1062517720&s=612x612&w=0&h=cOZzkiXa8eBpKCwTlOJsZrfVX_Sj87o_5d1q5sxPMRs=",
    "https://media.gettyimages.com/photos/young-woman-with-arms-outstretched-in-carefree-moment-picture-id1132469935?k=6&m=1132469935&s=612x612&w=0&h=pEm_AX4hsTV5Az02VhpDTmQOd_v1eaBfejY7Sz3QFjw=",
    "https://media.gettyimages.com/photos/man-taking-group-photo-of-family-at-bbq-picture-id1014773704?k=6&m=1014773704&s=612x612&w=0&h=966NRhhqoCR1yR9UPEN-4iqV7St2ujsxKC0KV4lkcqU=",
    "https://media.gettyimages.com/photos/business-people-working-in-the-office-picture-id1089813056?k=6&m=1089813056&s=612x612&w=0&h=uPWZkcBw4KAwKdrdZqtjFoFd8LuhgRqs8YsMBHURhI0=",
    "https://media.gettyimages.com/photos/group-of-friends-having-fun-picture-id1162987349?k=6&m=1162987349&s=612x612&w=0&h=1nSatpwHD-y77sl39RNWd8_prz6hx_U8_Qi8oJIteyI=",
    "https://media.gettyimages.com/photos/inspire-your-teams-to-keep-on-achieving-picture-id1139054510?k=6&m=1139054510&s=612x612&w=0&h=iYhVNxhwU7RmPKJQhyexW2q0oZawpyiGCZp9N6yKYfw=",
    "https://media.gettyimages.com/photos/portrait-of-woman-sitting-at-desk-in-design-office-picture-id1148558350?k=6&m=1148558350&s=612x612&w=0&h=7pyNhIWzrJCAlEHxj1ULzsupXpvmQN6EHWbyZQSGKn0=",
    "https://media.gettyimages.com/photos/hispanic-female-studying-on-laptop-picture-id1182745546?k=6&m=1182745546&s=612x612&w=0&h=owhz2cLDARmdh7afK11rcaQZL36J2Vk4HESX3GytwUk=",
    "https://media.gettyimages.com/photos/man-laughing-with-smart-phone-picture-id1189349093?k=6&m=1189349093&s=612x612&w=0&h=d9Cn7e02uKBTH0HwxC_le0kGLEidbbQCPenCQYpb42g=",
    "https://media.gettyimages.com/photos/smiling-woman-using-laptop-at-the-bar-picture-id1135176767?k=6&m=1135176767&s=612x612&w=0&h=7V50eYgNFUeiUVmc-gSEVCQB2H7QNTt7mCWGWiSnRX4=",
    "https://media.gettyimages.com/photos/handsome-indian-man-using-mobile-phone-picture-id1094067774?k=6&m=1094067774&s=612x612&w=0&h=P7ysJzmfaWZSzFarMw3jGLQMdVN1KL6CYvtBUIbQ1ck=",
    "https://media.gettyimages.com/photos/smile-as-though-you-have-already-achieved-success-picture-id937239290?k=6&m=937239290&s=612x612&w=0&h=Xb38-VcMFsZDcRRptGRD5BrqcgJTJx_ziiD49IKUXnE=",
    "https://media.gettyimages.com/photos/happy-mature-woman-looking-at-friend-in-forest-picture-id1007232098?k=6&m=1007232098&s=612x612&w=0&h=MocoJdHIshO-nGK0428Rjbd6NqJoiyN6alREvxcG-lE=",
    "https://media.gettyimages.com/photos/successful-business-team-taking-selfie-picture-id1132119295?k=6&m=1132119295&s=612x612&w=0&h=5xFh6k0MZUepwdl8p7URCbkcR5vDPLvjvBBJQNxTBNA=",
    "https://media.gettyimages.com/photos/business-video-conference-picture-id1184331589?k=6&m=1184331589&s=612x612&w=0&h=sUVd5ZBTrAwqZIbFSz0XE2sbc-FJzJOT4Kg3MHLAPXc=",
    "https://media.gettyimages.com/photos/business-team-smiling-during-a-meeting-picture-id1146500509?k=6&m=1146500509&s=612x612&w=0&h=iL_umje_01DijV_YtgaGt6ZyezaR0AsJqMGYzq3apZc=",
    "https://media.gettyimages.com/photos/laughing-woman-picture-id1138183258?k=6&m=1138183258&s=612x612&w=0&h=ECkpRqypJm5FfSzvoyrppsTYiFC_0uT7fIUjAQ_WEtg=",
    "https://media.gettyimages.com/photos/beautiful-curly-hair-woman-picture-id992048656?k=6&m=992048656&s=612x612&w=0&h=jYOWFNEXeh-U1CLS_RrKW4FI4IQHL5WcMCy_nnKAslk=",
    "https://media.gettyimages.com/photos/connected-in-comfort-picture-id1042058900?k=6&m=1042058900&s=612x612&w=0&h=IpToOKGB8sDaz50Imygy6hnNA6CO2JtdBa_b9AHuhMM=",
    "https://media.gettyimages.com/photos/colourful-studio-portrait-of-a-young-woman-picture-id1145099485?k=6&m=1145099485&s=612x612&w=0&h=R94jYs1azrC40gVs0v9PB4favDyBuk7T_uRMCdhxZIU=",
    "https://media.gettyimages.com/photos/portrait-business-women-in-the-office-picture-id919520858?k=6&m=919520858&s=612x612&w=0&h=SCLNf9lDUFY5hsH17-TWe1m_610HfhTa9A8I_emLHsE=",
    "https://media.gettyimages.com/photos/portrait-of-mature-woman-laughing-picture-id901670390?k=6&m=901670390&s=612x612&w=0&h=BpVV4oPKNKj_2HJIOdaZ5vT9ImQRiSZvje9STtL_avc=",
    "https://media.gettyimages.com/photos/you-make-me-happy-picture-id1178823473?k=6&m=1178823473&s=612x612&w=0&h=3__66kGPcZl84btUuEpKt_vrbqvKTCFsJIOLQhp_Jps=",
    "https://media.gettyimages.com/photos/thinking-about-how-to-take-the-business-to-technological-heights-picture-id906798262?k=6&m=906798262&s=612x612&w=0&h=troEgYErvqNrlo2yfLSeQEGpatvsJow11j7roBJJHLw=",
    "https://media.gettyimages.com/photos/family-sitting-on-pier-by-the-sea-picture-id1002673938?k=6&m=1002673938&s=612x612&w=0&h=7r58l3YSKvymCtNigkNUpBYLuVkix__mU4vETDCK63M=",
    "https://media.gettyimages.com/photos/professionals-laughing-in-a-meeting-picture-id1150572098?k=6&m=1150572098&s=612x612&w=0&h=-EI95-Pziv3yOfh6EsxU-GT4l2SalmpHoId7511Dz2M=",
    "https://media.gettyimages.com/photos/run-your-company-with-confidence-picture-id981750034?k=6&m=981750034&s=612x612&w=0&h=_ETPwPGwu2j49GVACQ-BCwkFsZSRugQFY_6FRnnaxQI=",
    "https://media.gettyimages.com/photos/young-couple-with-smart-phone-relaxing-on-sofa-picture-id974230862?k=6&m=974230862&s=612x612&w=0&h=ZeOZHr3d4fzUuCy02jTq82AdfKiBdXpIzbvbOkieCTY=",
    "https://media.gettyimages.com/photos/the-love-of-best-friends-picture-id972902038?k=6&m=972902038&s=612x612&w=0&h=Q5EbQ5RhL2ZXM3lnQobRgjEK0g8YM9T4hmbof0sBbf8=",
    "https://media.gettyimages.com/photos/portrait-of-mature-man-dancing-and-having-fun-picture-id903060758?k=6&m=903060758&s=612x612&w=0&h=ReS7XMO8sumOGI3eaKvFP29Fy7SkUkOZOmxj_2fhH2A=",
    "https://media.gettyimages.com/photos/happy-senior-woman-leading-her-family-to-perfect-picnic-place-on-the-picture-id1135289130?k=6&m=1135289130&s=612x612&w=0&h=-4MjxZhRquC2IUHCsf7mgXTkzSaLfSNBcQrBHwq7fa4=",
    "https://media.gettyimages.com/photos/happy-woman-talking-on-phone-picture-id1127794824?k=6&m=1127794824&s=612x612&w=0&h=QAQm83IM0GyBTHQ_5HoTVSEkI6zWmwxYDFGoVgPXqNI=",
    "https://media.gettyimages.com/photos/happy-kids-happy-family-picture-id1009877634?k=6&m=1009877634&s=612x612&w=0&h=7z6yRXGO_JcC3QnMvuaf4RpSVRjjDgybsITYmrByjxE=",
    "https://media.gettyimages.com/photos/the-success-of-a-business-leans-on-its-team-picture-id1023552044?k=6&m=1023552044&s=612x612&w=0&h=Lt2vXZMKySPDLyW2KqVpQoKQKoDIhk7J7xu4UfMsN7Q=",
    "https://media.gettyimages.com/photos/road-trips-put-me-in-a-happy-mood-picture-id1133563360?k=6&m=1133563360&s=612x612&w=0&h=kAXQSco-g3SqfUljxibcTvSyXJ4G007sZ7GS0B5F4Yo=",
    "https://media.gettyimages.com/photos/always-be-ready-when-business-comes-calling-picture-id1144585582?k=6&m=1144585582&s=612x612&w=0&h=JvlDU9yUEvsPNk0nP8MprU8QXXbgS3jN9TjmMjnhmfo=",
    "https://media.gettyimages.com/photos/this-team-is-built-for-success-picture-id629667248?k=6&m=629667248&s=612x612&w=0&h=61gZlmPtT5Ta9sTaKNDaExHi2yZypt5NeDOPfEF7qTQ=",
    "https://media.gettyimages.com/photos/boy-and-dog-in-toy-racing-car-picture-id1162019476?k=6&m=1162019476&s=612x612&w=0&h=3FWAHt58LjBXH_oKNqG7kB45ULUsH1MLmLl5Cpea7ek=",
    "https://media.gettyimages.com/photos/mature-couple-relaxing-with-tablet-and-smartphone-picture-id915361676?k=6&m=915361676&s=612x612&w=0&h=WGUTZqek_i9eINKvfxOcmXX5MGkzRT3I-tWFNbNGaOU=",
    "https://media.gettyimages.com/photos/portrait-of-a-beautiful-young-indian-woman-picture-id917499044?k=6&m=917499044&s=612x612&w=0&h=lx17asXD4jaIlXrFgBdd8Tinl0oSe43K0All11IjKWY=",
  ];

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
    console.log("Scrapped User Images");

    return imgUrl;
  } catch (err) {
    console.log("Went wrong", err);
  }
}
